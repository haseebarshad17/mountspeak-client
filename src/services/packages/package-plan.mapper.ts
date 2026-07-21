import type { TourPage } from '@/components/pages/tour/sections/tour-page.types'
import { applyTourSectionFallbacks } from '@/lib/tours/tour-section-fallbacks'
import { resolvePackageMediaUrlOrPlaceholder, type PackageMediaKind } from '@/lib/supabase/package-media'
import { isPackageBookingClosed } from '@/lib/booking/tour-booking-rules'
import type { ListingKind } from '@/lib/homepage/specialization'
import {
    createEmptyPackageTourSections,
    mapPackageHotelsToStaySection,
    mapPackageIncludesToPerks,
    mapPackageZiyaratToRouteSection,
} from '@/lib/tours/package-page-sections'
import {
    INTERNATIONAL_INQUIRY_PRIMARY_LABEL,
    PACKAGE_BOOKING_REQUEST_SECTION_ID,
} from '@/lib/tours/tour-inquiry-cta'

type PackageItemsList = {
    items?: string[] | null
} | null

type PackageHotelLike = {
    hotel_name?: string | null
    hotel_rating?: string | null
    number_of_nights?: number | null
    room_type?: string | null
    distance_from_haram_meters?: number | null
    distance_from_masjid_e_nabawi_meters?: number | null
    image?: string | null
} | null

type PackagePlanRow = {
    id: string
    basic_information?: {
        package_title?: string | null
        package_category?: string | null
    } | null
    pricing?: {
        original_price?: number | null
        discount_price?: number | null
    } | null
    duration_dates?: {
        departure_date?: string | null
        duration_days?: number | null
        return_date?: string | null
    } | null
    booking_info?: {
        available_seats?: number | null
        booking_deadline?: string | null
    } | null
    images?: {
        featured_image?: string | null
        gallery_images?: string[] | null
    } | null
    descriptions?: {
        short_description?: string | null
        detailed_description?: string | null
    } | null
    seo?: {
        meta_title?: string | null
        meta_description?: string | null
        meta_keywords?: string | null
    } | null
    makkah_hotel?: PackageHotelLike
    madinah_hotel?: PackageHotelLike
    hotels?: {
        makkah_hotel?: PackageHotelLike
        madinah_hotel?: PackageHotelLike
    } | null
    ziyarat?: {
        makkah_ziyarat_details?: string | null
        madinah_ziyarat_details?: string | null
    } | null
    itinerary?: {
        makkah_ziyarat_details?: string | null
        madinah_ziyarat_details?: string | null
    } | null
    package_includes?: PackageItemsList
}

function resolvePackagePrice(pricing: PackagePlanRow['pricing']) {
    const original = Number(pricing?.original_price ?? 0)
    const discounted = Number(pricing?.discount_price ?? 0)

    if (original > 0 && discounted > 0 && discounted < original) {
        return { pricePerSeat: original, discountPercent: Math.round(((original - discounted) / original) * 100) }
    }

    if (original > 0) {
        return { pricePerSeat: original, discountPercent: null }
    }

    return { pricePerSeat: null, discountPercent: null }
}

function resolvePackageHotels(plan: PackagePlanRow) {
    const makkah = plan.makkah_hotel ?? plan.hotels?.makkah_hotel ?? null
    const madinah = plan.madinah_hotel ?? plan.hotels?.madinah_hotel ?? null
    return { makkah, madinah }
}

function resolvePackageZiyarat(plan: PackagePlanRow) {
    const source = plan.ziyarat ?? plan.itinerary ?? null
    return {
        makkah: source?.makkah_ziyarat_details ?? null,
        madinah: source?.madinah_ziyarat_details ?? null,
    }
}

export function mapPackagePlanToTourPage(
    plan: PackagePlanRow,
    kind: Exclude<ListingKind, 'tour'>,
): TourPage {
    const mediaKind: PackageMediaKind = kind === 'umrah' ? 'umrah' : 'international'

    const title = plan.basic_information?.package_title?.trim() || (kind === 'umrah' ? 'Umrah package' : 'International tour')
    const heroImage = resolvePackageMediaUrlOrPlaceholder(plan.images?.featured_image, mediaKind)
    const departureDate = plan.duration_dates?.departure_date?.trim() || null
    const bookingDeadline = plan.booking_info?.booking_deadline?.trim() || null
    const durationDays = plan.duration_dates?.duration_days ?? null
    const { pricePerSeat, discountPercent } = resolvePackagePrice(plan.pricing)
    const shortDescription = plan.descriptions?.short_description?.trim() || ''
    const detailedDescription = plan.descriptions?.detailed_description?.trim() || shortDescription
    const gallery = (plan.images?.gallery_images ?? [])
        .map((url) => resolvePackageMediaUrlOrPlaceholder(url, mediaKind))
        .filter(Boolean)
    const { makkah, madinah } = resolvePackageHotels(plan)
    const ziyarat = resolvePackageZiyarat(plan)
    const includeItems = plan.package_includes?.items ?? []
    const emptySections = createEmptyPackageTourSections()
    const bookingHref = `#${PACKAGE_BOOKING_REQUEST_SECTION_ID}`
    const primaryBookLabel = INTERNATIONAL_INQUIRY_PRIMARY_LABEL

    const page = applyTourSectionFallbacks({
        id: plan.id,
        slug: plan.id,
        listingKind: kind,
        packageInquiry: {
            packageId: plan.id,
            title,
            departureDate,
        },
        type: 'expedition_detail',
        status: 'published',
        locale: 'en',
        seo: {
            metaTitle: plan.seo?.meta_title?.trim() || title,
            metaDescription: plan.seo?.meta_description?.trim() || shortDescription,
            keywords: plan.seo?.meta_keywords?.trim()
                ? plan.seo.meta_keywords.split(',').map((item) => item.trim()).filter(Boolean)
                : [],
            ogImage: heroImage,
            canonicalUrl: `/packages/${kind}/${plan.id}`,
        },
        theme: {
            primaryColor: '#0E3B43',
            secondaryColor: '#0E3B43',
            backgroundColor: '#F5F5F2',
            textColor: '#1F1F1F',
            fontHeading: 'Jost',
            fontBody: 'Roboto',
        },
        navigation: {
            transparent: true,
            logo: { type: 'image', src: heroImage, alt: title },
            menuItems: [],
            cta: { label: 'Search', url: '/search', variant: 'primary-light' },
        },
        heroSection: {
            id: 'hero',
            layout: 'full-bleed-overlay',
            backgroundMedia: {
                type: 'image',
                desktop: heroImage,
                tablet: heroImage,
                mobile: heroImage,
                alt: title,
            },
            overlay: { enabled: true, color: '#000000', opacity: 0.45 },
            eyebrow: kind === 'umrah' ? 'UMRAH PACKAGE' : 'INTERNATIONAL TOUR',
            title,
            subtitle: shortDescription,
            tripHighlights: [
                ...(durationDays
                    ? [{ icon: 'calendar' as const, label: `${durationDays} DAYS` }]
                    : []),
                ...(pricePerSeat != null
                    ? [{ icon: 'price' as const, label: `FROM PKR ${pricePerSeat.toLocaleString()} / SEAT` }]
                    : []),
                ...(discountPercent != null && discountPercent > 0
                    ? [{ icon: 'price' as const, label: `${discountPercent}% OFF` }]
                    : []),
            ],
            ctaGroup: [
                {
                    label: primaryBookLabel,
                    url: bookingHref,
                    style: 'primary',
                },
            ],
        },
        overviewSection: {
            id: 'overview',
            title: 'Overview',
            description: detailedDescription || shortDescription,
            statistics: [],
            sideCard: {
                type: 'image',
                title,
                image: heroImage,
                alt: title,
            },
            highlightColumns: [],
        },
        ...emptySections,
        technicalRouteSection: mapPackageZiyaratToRouteSection(ziyarat.makkah, ziyarat.madinah),
        stayAndDineSection: mapPackageHotelsToStaySection(makkah, madinah, mediaKind),
        perksAndTechnicalsSection: {
            id: 'perks-technicals',
            title: 'Package highlights',
            items: mapPackageIncludesToPerks(includeItems),
        },
        gallerySection: {
            id: 'visual-fragments',
            background: 'dark',
            eyebrow: 'THE EXPERIENCE',
            title: 'Gallery',
            actionLabel: 'VIEW FULL GALLERY',
            actionUrl: bookingHref,
            layout: 'masonry-grid',
            media: gallery.map((src, index) => ({
                id: `gallery-${index + 1}`,
                type: 'image' as const,
                src,
                alt: `${title} gallery ${index + 1}`,
            })),
        },
        finalCtaSection: {
            id: 'final-cta',
            title:
                kind === 'international'
                    ? 'Interested in this international tour?'
                    : 'Ready to plan your Umrah?',
            buttons: [
                {
                    label: primaryBookLabel,
                    url: bookingHref,
                    style: 'primary',
                },
                {
                    label: 'Contact Us',
                    url: '/contact-us',
                    style: 'secondary',
                },
            ],
        },
        isBookingClosed: isPackageBookingClosed({ departureDate, bookingDeadline }),
    } as unknown as TourPage)

    return page
}
