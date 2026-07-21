import type { TourPage } from '@/components/pages/tour/sections/tour-page.types'
import { resolveTourMediaUrlOrPlaceholder } from '@/lib/supabase/tour-media'
import { resolveThemeButtons } from '@/lib/homepage/theme'
import { isTourBookingClosed } from '@/lib/booking/tour-booking-rules'
import type { Theme } from '@/services/homepage/homepage.page.types'

import { buildBookingHref } from '@/components/pages/booking/booking.types'
import { applyTourSectionFallbacks } from '@/lib/tours/tour-section-fallbacks'

import { getTourCategoryLabel, normalizeTourCategory } from './tours.category'
import { formatPickupTimeDisplay } from './tours.pickup'
import type { TourPickupPoint } from './tours.pickup'
import type { TourRecord } from './tours.payload.types'
import { tourDetailPath } from './tours.utils'

const DEFAULT_THEME: TourPage['theme'] = {
    primaryColor: '#0E3B43',
    secondaryColor: '#0E3B43',
    backgroundColor: '#F5F5F2',
    textColor: '#1F1F1F',
    fontHeading: 'Jost',
    fontBody: 'Roboto',
}

export function applyAgencyThemeToTourPage(
    page: TourPage,
    homepageTheme?: Theme | null,
): TourPage {
    if (!homepageTheme) return page

    const { primary } = resolveThemeButtons(homepageTheme)
    const accentColor = primary.background

    return {
        ...page,
        theme: {
            ...page.theme,
            primaryColor: accentColor,
            secondaryColor: accentColor,
        },
    }
}

const PERK_ICON_ALIASES: Record<string, string> = {
    medical: 'medical-kit',
    gear: 'mountain-tools',
    transport: 'mountain-tools',
    meals: 'chef-hat',
    guide: 'mountain-tools',
    camera: 'chef-hat',
    backpack: 'mountain-tools',
}

function slugifyId(value: string, index?: number): string {
    const base = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

    return index != null ? `${base}-${index}` : base || `item-${index ?? 0}`
}

function mapPerkIcon(icon: string): string {
    return PERK_ICON_ALIASES[icon] ?? icon
}

function formatDayNightLabel(dayCount?: number, nightCount?: number): string {
    if (dayCount == null && nightCount == null) return ''
    const days = dayCount ?? 0
    const nights = nightCount ?? Math.max(0, days - 1)
    return `${days} DAYS / ${nights} NIGHTS`
}

export function mapTourRecordToPage(row: TourRecord, pickupPoints: TourPickupPoint[] = []): TourPage {
    const header = row.header
    const overview = row.overview
    const heroUrl = resolveTourMediaUrlOrPlaceholder(header?.hero_image_url)
    const overviewImage = resolveTourMediaUrlOrPlaceholder(overview?.image_url)
    const dayNight = formatDayNightLabel(header?.day_count, header?.night_count)

    const tripHighlights = [
        ...(dayNight
            ? [{ icon: 'calendar' as const, label: dayNight }]
            : []),
        ...(overview?.difficulty
            ? [{ icon: 'mountain' as const, label: overview.difficulty.toUpperCase() }]
            : []),
        ...(row.price_per_seat != null
            ? [
                {
                    icon: 'price' as const,
                    label: `FROM PKR ${Number(row.price_per_seat).toLocaleString()} / SEAT`,
                },
            ]
            : []),
    ]

    return applyTourSectionFallbacks({
        id: row.id,
        slug: row.slug,
        type: 'expedition_detail',
        status: row.publication_status === 'PUBLISHED' ? 'published' : 'draft',
        locale: 'en',
        isBookingClosed: isTourBookingClosed(row.start_date),
        seo: {
            metaTitle: header?.title ?? row.title,
            metaDescription: overview?.body?.slice(0, 160) ?? row.title,
            keywords: [row.to_location, row.from_location, row.title].filter(Boolean) as string[],
            ogImage: heroUrl || '',
            canonicalUrl: tourDetailPath(row.slug),
        },
        theme: DEFAULT_THEME,
        navigation: {
            transparent: true,
            logo: { type: 'image', src: '/branding/phnes-travels-logo-white.svg', alt: 'Phnes Travels' },
            menuItems: [],
            cta: { label: 'Sign Up', url: '/signup', variant: 'primary-light' },
        },
        heroSection: {
            id: 'hero',
            layout: 'full-bleed-overlay',
            backgroundMedia: {
                type: 'image',
                desktop: heroUrl,
                tablet: heroUrl,
                mobile: heroUrl,
                alt: header?.title ?? row.title,
            },
            overlay: { enabled: true, color: '#000000', opacity: 0.45 },
            eyebrow:
                header?.tag?.trim() ||
                getTourCategoryLabel(normalizeTourCategory(row.category)) ||
                '',
            title: header?.title ?? row.title,
            subtitle: header?.subtitle ?? '',
            tripHighlights,
            ctaGroup: [
                {
                    label: 'BOOK TOUR NOW',
                    url: buildBookingHref(row.slug),
                    style: 'primary' as const,
                },
            ],
        },
        overviewSection: {
            id: 'overview',
            title: overview?.title ?? 'Overview',
            description: overview?.body ?? '',
            statistics: [],
            sideCard: {
                type: 'map',
                title: 'EXPEDITION ROUTE',
                image: overviewImage || heroUrl,
                alt: overview?.title ?? row.title,
            },
            highlightColumns: [],
        },
        technicalRouteSection: {
            id: 'technical-route',
            title: row.route?.section_title ?? 'Route',
            background: 'light-card',
            segments: (row.route?.segments ?? []).map((seg, index) => ({
                segmentId: slugifyId(seg.title, index),
                title: seg.title,
                description: seg.description,
                distanceKm: 0,
                estimatedDuration: '',
                terrain: [],
            })),
        },
        placesVisitedSection: {
            id: 'places-visited',
            eyebrow: 'CULTURAL LANDMARKS',
            title: 'Places to be visited',
            intro:
                row.to_location && row.from_location
                    ? `From ${row.from_location} to ${row.to_location}, explore the highlights of this expedition.`
                    : 'Discover the landmarks included on this journey.',
            cards: (row.places_visited ?? []).map((place, index) => {
                const locationLabel = place.location_label?.trim() ?? ''

                return {
                    id: slugifyId(place.name, index),
                    title: place.name,
                    location: locationLabel ? locationLabel.toUpperCase() : '',
                    category: locationLabel ? locationLabel.toUpperCase() : '',
                    thumbnail: resolveTourMediaUrlOrPlaceholder(place.image_url),
                    gallery: [resolveTourMediaUrlOrPlaceholder(place.image_url)],
                    description: place.name,
                }
            }),
        },
        itinerarySection: {
            id: 'itinerary',
            title: 'Day-by-Day Journey',
            timelineStyle: 'zigzag-cards',
            days: (row.journey ?? []).map((day) => ({
                day: day.day,
                title: day.title,
                description: day.description,
                image: resolveTourMediaUrlOrPlaceholder(day.image_url),
                alt: day.title,
                activities: [],
                accommodation: '',
            })),
        },
        stayAndDineSection: {
            id: 'stay-dine',
            title: 'Stay & Dine',
            properties: (row.stay_and_dine ?? []).map((stay, index) => ({
                id: slugifyId(stay.name, index),
                type: stay.category,
                name: stay.name,
                thumbnail: resolveTourMediaUrlOrPlaceholder(stay.image_url),
                description: stay.description,
                amenities: stay.amenities ?? [],
                rating: 0,
            })),
        },
        perksAndTechnicalsSection: {
            id: 'perks-technicals',
            title: 'Expedition Perks & Technicals',
            items: (row.expedition_perks ?? []).map((perk) => ({
                icon: mapPerkIcon(perk.icon),
                title: perk.title,
                description: perk.description,
            })),
        },
        gallerySection: {
            id: 'visual-fragments',
            background: 'dark',
            eyebrow: 'THE EXPERIENCE',
            title: 'Visual Fragments',
            actionLabel: 'VIEW FULL GALLERY',
            actionUrl: tourDetailPath(row.slug),
            layout: 'masonry-grid',
            media: (row.visual_fragments ?? []).map((src, index) => ({
                id: `gallery-${index + 1}`,
                type: 'image' as const,
                src: resolveTourMediaUrlOrPlaceholder(src),
                alt: `${row.title} gallery ${index + 1}`,
            })),
        },
        finalCtaSection: {
            id: 'final-cta',
            title: 'Are you ready to witness the peaks of giants?',
            description: 'Connect with our expedition specialists to customize your journey.',
            buttons: [
                {
                    label: 'BOOK TOUR NOW',
                    url: buildBookingHref(row.slug),
                    style: 'primary',
                },
                { label: 'Contact Us', url: '/contact-us', style: 'secondary' },
            ],
        },
        pickupPointsSection:
            pickupPoints.length > 0
                ? {
                      id: 'pickup-points',
                      title: 'Pickup points',
                      intro:
                          pickupPoints.length > 1
                              ? 'Passengers can join this trip from the following cities.'
                              : 'Passengers board from the city below.',
                      points: pickupPoints.map((point) => ({
                          id: point.id,
                          city: point.city,
                          pickupTime: formatPickupTimeDisplay(point.pickupTime),
                          notes: point.notes,
                          isPrimary: point.isPrimary,
                      })),
                  }
                : undefined,
    })
}
