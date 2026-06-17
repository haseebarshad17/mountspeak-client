import type { TourPage } from '@/components/pages/tour/sections/tour-page.types'
import { resolveTourMediaUrl } from '@/lib/supabase/tour-media'

import { buildBookingHref } from '@/components/pages/booking/booking.types'

import type { TourRecord } from './tours.payload.types'
import { tourDetailPath } from './tours.utils'

const DEFAULT_THEME: TourPage['theme'] = {
    primaryColor: '#0E3B43',
    secondaryColor: '#F26A3D',
    backgroundColor: '#F5F5F2',
    textColor: '#1F1F1F',
    fontHeading: 'Jost',
    fontBody: 'Roboto',
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

export function mapTourRecordToPage(row: TourRecord): TourPage {
    const header = row.header
    const overview = row.overview
    const heroUrl = resolveTourMediaUrl(header?.hero_image_url)
    const overviewImage = resolveTourMediaUrl(overview?.image_url)
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

    return {
        id: row.id,
        slug: row.slug,
        type: 'expedition_detail',
        status: row.publication_status === 'PUBLISHED' ? 'published' : 'draft',
        locale: 'en',
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
            eyebrow: header?.tag ?? '',
            title: header?.title ?? row.title,
            subtitle: header?.subtitle ?? '',
            tripHighlights,
            ctaGroup: [],
        },
        overviewSection: {
            id: 'overview',
            title: overview?.title ?? 'Overview',
            description: overview?.body ?? '',
            statistics: [
                ...(overview?.elevation_m != null
                    ? [{ label: 'MAX ELEVATION', value: `${overview.elevation_m}m` }]
                    : []),
                ...(overview?.difficulty
                    ? [{ label: 'DIFFICULTY', value: overview.difficulty }]
                    : []),
            ],
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
            title: 'Places Visited',
            intro:
                row.to_location && row.from_location
                    ? `From ${row.from_location} to ${row.to_location}, explore the highlights of this expedition.`
                    : 'Discover the landmarks included on this journey.',
            cards: (row.places_visited ?? []).map((place, index) => ({
                id: slugifyId(place.name, index),
                title: place.name,
                location: place.location_label.toUpperCase(),
                category: place.location_label.toUpperCase(),
                thumbnail: resolveTourMediaUrl(place.image_url),
                gallery: [resolveTourMediaUrl(place.image_url)],
                description: place.name,
            })),
        },
        itinerarySection: {
            id: 'itinerary',
            title: 'Day-by-Day Journey',
            timelineStyle: 'zigzag-cards',
            days: (row.journey ?? []).map((day) => ({
                day: day.day,
                title: day.title,
                description: day.description,
                image: resolveTourMediaUrl(day.image_url),
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
                thumbnail: resolveTourMediaUrl(stay.image_url),
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
                src: resolveTourMediaUrl(src),
                alt: `${row.title} gallery ${index + 1}`,
            })),
        },
        finalCtaSection: {
            id: 'final-cta',
            title: 'Are you ready to witness the peaks of giants?',
            description: 'Connect with our expedition specialists to customize your journey.',
            buttons: [
                {
                    label: 'BOOK AN EXPEDITION',
                    url: buildBookingHref(row.slug),
                    style: 'primary',
                },
                { label: 'SPEAK WITH AN EXPERT', url: '/contact-us', style: 'secondary' },
            ],
        },
    }
}
