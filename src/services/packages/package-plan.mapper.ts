import type { TourPage } from '@/components/pages/tour/sections/tour-page.types'
import { applyTourSectionFallbacks } from '@/lib/tours/tour-section-fallbacks'
import { resolveTourMediaUrlOrPlaceholder } from '@/lib/supabase/tour-media'
import { isTourBookingClosed } from '@/lib/booking/tour-booking-rules'
import {
    INTERNATIONAL_INQUIRY_PRIMARY_LABEL,
    PACKAGE_BOOKING_REQUEST_SECTION_ID,
} from '@/lib/tours/tour-inquiry-cta'
import type { ListingKind } from '@/lib/homepage/specialization'

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

export function mapPackagePlanToTourPage(
    plan: PackagePlanRow,
    kind: Exclude<ListingKind, 'tour'>,
): TourPage {
    const title = plan.basic_information?.package_title?.trim() || (kind === 'umrah' ? 'Umrah package' : 'International tour')
    const heroImage = resolveTourMediaUrlOrPlaceholder(plan.images?.featured_image)
    const departureDate = plan.duration_dates?.departure_date?.trim() || null
    const durationDays = plan.duration_dates?.duration_days ?? null
    const { pricePerSeat, discountPercent } = resolvePackagePrice(plan.pricing)
    const shortDescription = plan.descriptions?.short_description?.trim() || ''
    const detailedDescription = plan.descriptions?.detailed_description?.trim() || shortDescription
    const gallery = (plan.images?.gallery_images ?? [])
        .map((url) => resolveTourMediaUrlOrPlaceholder(url))
        .filter(Boolean)

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
            ctaGroup:
                kind === 'international'
                    ? [
                          {
                              label: INTERNATIONAL_INQUIRY_PRIMARY_LABEL,
                              url: `#${PACKAGE_BOOKING_REQUEST_SECTION_ID}`,
                              style: 'primary',
                          },
                      ]
                    : [],
        },
        perksAndTechnicalsSection: {
            id: 'perks-technicals',
            title: 'Package highlights',
            items: [],
        },
        gallerySection: {
            id: 'visual-fragments',
            background: 'dark',
            eyebrow: 'THE EXPERIENCE',
            title: 'Gallery',
            actionLabel: 'VIEW FULL GALLERY',
            actionUrl: `#${PACKAGE_BOOKING_REQUEST_SECTION_ID}`,
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
                    : kind === 'umrah'
                      ? 'Ready to plan your Umrah?'
                      : 'Ready for your next adventure?',
            buttons:
                kind === 'international'
                    ? [
                          {
                              label: INTERNATIONAL_INQUIRY_PRIMARY_LABEL,
                              url: `#${PACKAGE_BOOKING_REQUEST_SECTION_ID}`,
                              style: 'primary',
                          },
                          {
                              label: 'Contact Us',
                              url: '/contact-us',
                              style: 'secondary',
                          },
                      ]
                    : kind === 'umrah'
                      ? [
                            {
                                label: 'Contact Us',
                                url: '/contact-us',
                                style: 'primary',
                            },
                        ]
                      : [],
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
        isBookingClosed: isTourBookingClosed(departureDate),
    } as unknown as TourPage)

    return page
}
