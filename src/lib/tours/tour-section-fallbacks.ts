import type { TourPage } from '@/components/pages/tour/sections/tour-page.types'
import { TOUR_MEDIA_PLACEHOLDER } from '@/lib/supabase/tour-media'

function withListFallback<T>(value: T[] | undefined | null, fallback: T[]): T[] {
    return value && value.length > 0 ? value : fallback
}

function withTextFallback(value: string | undefined | null, fallback: string): string {
    const trimmed = value?.trim()
    return trimmed ? trimmed : fallback
}

const LOREM_TITLE = 'Lorem Ipsum'
const LOREM_SHORT =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
const LOREM_BODY =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.'

const PLACEHOLDER_IMAGE = TOUR_MEDIA_PLACEHOLDER
const PLACEHOLDER_IMAGE_ALT = 'Placeholder image'

const PLACEHOLDER_STATISTICS: TourPage['overviewSection']['statistics'] = []

const PLACEHOLDER_ROUTE_SEGMENTS: TourPage['technicalRouteSection']['segments'] = [
    {
        segmentId: 'placeholder-segment-1',
        title: 'Lorem Ipsum Segment 01',
        description: LOREM_SHORT,
        distanceKm: 0,
        estimatedDuration: '',
        terrain: [],
    },
    {
        segmentId: 'placeholder-segment-2',
        title: 'Lorem Ipsum Segment 02',
        description: LOREM_SHORT,
        distanceKm: 0,
        estimatedDuration: '',
        terrain: [],
    },
    {
        segmentId: 'placeholder-segment-3',
        title: 'Lorem Ipsum Segment 03',
        description: LOREM_SHORT,
        distanceKm: 0,
        estimatedDuration: '',
        terrain: [],
    },
]

const PLACEHOLDER_PLACES_CARDS: TourPage['placesVisitedSection']['cards'] = [
    {
        id: 'placeholder-place-1',
        title: 'Lorem Ipsum Place',
        location: 'LOREM',
        category: 'PLACEHOLDER',
        thumbnail: PLACEHOLDER_IMAGE,
        gallery: [PLACEHOLDER_IMAGE],
        description: LOREM_SHORT,
    },
    {
        id: 'placeholder-place-2',
        title: 'Dolor Sit Amet',
        location: 'IPSUM',
        category: 'PLACEHOLDER',
        thumbnail: PLACEHOLDER_IMAGE,
        gallery: [PLACEHOLDER_IMAGE],
        description: LOREM_SHORT,
    },
    {
        id: 'placeholder-place-3',
        title: 'Consectetur Elit',
        location: 'DOLOR',
        category: 'PLACEHOLDER',
        thumbnail: PLACEHOLDER_IMAGE,
        gallery: [PLACEHOLDER_IMAGE],
        description: LOREM_SHORT,
    },
    {
        id: 'placeholder-place-4',
        title: 'Adipiscing Magna',
        location: 'SIT',
        category: 'PLACEHOLDER',
        thumbnail: PLACEHOLDER_IMAGE,
        gallery: [PLACEHOLDER_IMAGE],
        description: LOREM_SHORT,
    },
]

const PLACEHOLDER_ITINERARY_DAYS: TourPage['itinerarySection']['days'] = [
    {
        day: 1,
        title: 'Lorem Ipsum Day One',
        description: LOREM_BODY,
        image: PLACEHOLDER_IMAGE,
        alt: PLACEHOLDER_IMAGE_ALT,
        activities: [],
        accommodation: '',
    },
    {
        day: 2,
        title: 'Lorem Ipsum Day Two',
        description: LOREM_BODY,
        image: PLACEHOLDER_IMAGE,
        alt: PLACEHOLDER_IMAGE_ALT,
        activities: [],
        accommodation: '',
    },
    {
        day: 3,
        title: 'Lorem Ipsum Day Three',
        description: LOREM_BODY,
        image: PLACEHOLDER_IMAGE,
        alt: PLACEHOLDER_IMAGE_ALT,
        activities: [],
        accommodation: '',
    },
]

const PLACEHOLDER_STAY_PROPERTIES: TourPage['stayAndDineSection']['properties'] = [
    {
        id: 'placeholder-stay-1',
        type: 'LOREM LODGING',
        name: 'Lorem Ipsum Hotel',
        thumbnail: PLACEHOLDER_IMAGE,
        description: LOREM_SHORT,
        amenities: ['LOREM IPSUM', 'DOLOR SIT'],
        rating: 0,
    },
    {
        id: 'placeholder-stay-2',
        type: 'LOCAL PARTNER',
        name: 'Dolor Sit Restaurant',
        thumbnail: PLACEHOLDER_IMAGE,
        description: LOREM_SHORT,
        amenities: ['AMET ELIT', 'MAGNA ALIQUA'],
        rating: 0,
    },
    {
        id: 'placeholder-stay-3',
        type: 'ALPINE RETREAT',
        name: 'Consectetur Lodge',
        thumbnail: PLACEHOLDER_IMAGE,
        description: LOREM_SHORT,
        amenities: ['PLACEHOLDER', 'LOREM IPSUM'],
        rating: 0,
    },
]

const PLACEHOLDER_PERKS: TourPage['perksAndTechnicalsSection']['items'] = [
    {
        icon: 'mountain-tools',
        title: 'Lorem Ipsum Perk',
        description: LOREM_SHORT,
    },
    {
        icon: 'chef-hat',
        title: 'Dolor Sit Amet',
        description: LOREM_SHORT,
    },
    {
        icon: 'wifi',
        title: 'Consectetur Elit',
        description: LOREM_SHORT,
    },
    {
        icon: 'medical-kit',
        title: 'Adipiscing Magna',
        description: LOREM_SHORT,
    },
]

const PLACEHOLDER_GALLERY_MEDIA: TourPage['gallerySection']['media'] = [
    {
        id: 'placeholder-gallery-1',
        type: 'image',
        src: PLACEHOLDER_IMAGE,
        alt: PLACEHOLDER_IMAGE_ALT,
    },
    {
        id: 'placeholder-gallery-2',
        type: 'image',
        src: PLACEHOLDER_IMAGE,
        alt: PLACEHOLDER_IMAGE_ALT,
    },
    {
        id: 'placeholder-gallery-3',
        type: 'image',
        src: PLACEHOLDER_IMAGE,
        alt: PLACEHOLDER_IMAGE_ALT,
    },
    {
        id: 'placeholder-gallery-4',
        type: 'image',
        src: PLACEHOLDER_IMAGE,
        alt: PLACEHOLDER_IMAGE_ALT,
    },
]

export function applyTourSectionFallbacks(page: TourPage): TourPage {
    const isPackagePage = page.listingKind === 'umrah' || page.listingKind === 'international'

    const overviewSection = page.overviewSection ?? {
        id: 'overview',
        title: 'Overview',
        description: '',
        statistics: [],
        sideCard: { type: 'image' as const, title: '', image: '', alt: '' },
        highlightColumns: [],
    }

    const technicalRouteSection = page.technicalRouteSection ?? {
        id: 'technical-route',
        title: isPackagePage ? 'Route' : LOREM_TITLE,
        background: 'light-card' as const,
        segments: [],
    }

    const placesVisitedSection = page.placesVisitedSection ?? {
        id: 'places-visited',
        eyebrow: 'HIGHLIGHTS',
        title: 'Places to be visited',
        intro: '',
        cards: [],
    }

    const itinerarySection = page.itinerarySection ?? {
        id: 'itinerary',
        title: 'Day-by-Day Journey',
        timelineStyle: 'zigzag-cards' as const,
        days: [],
    }

    const stayAndDineSection = page.stayAndDineSection ?? {
        id: 'stay-and-dine',
        title: 'Stay & Dine',
        properties: [],
    }

    const perksAndTechnicalsSection = page.perksAndTechnicalsSection ?? {
        id: 'perks-technicals',
        title: 'Package highlights',
        items: [],
    }

    const gallerySection = page.gallerySection ?? {
        id: 'visual-fragments',
        background: 'dark' as const,
        eyebrow: 'THE EXPERIENCE',
        title: 'Gallery',
        actionLabel: 'VIEW FULL GALLERY',
        actionUrl: '#',
        layout: 'masonry-grid' as const,
        media: [],
    }

    // Package pages keep real empty sections — no Lorem Ipsum placeholders.
    if (isPackagePage) {
        return {
            ...page,
            overviewSection: {
                ...overviewSection,
                sideCard: {
                    ...overviewSection.sideCard,
                    image: overviewSection.sideCard.image?.trim()
                        ? overviewSection.sideCard.image
                        : PLACEHOLDER_IMAGE,
                },
            },
            technicalRouteSection,
            placesVisitedSection,
            itinerarySection,
            stayAndDineSection,
            perksAndTechnicalsSection,
            gallerySection,
        }
    }

    return {
        ...page,
        overviewSection: {
            ...overviewSection,
            description: withTextFallback(overviewSection.description, LOREM_BODY),
            statistics: withListFallback(overviewSection.statistics, PLACEHOLDER_STATISTICS),
            sideCard: {
                ...overviewSection.sideCard,
                image: overviewSection.sideCard.image?.trim()
                    ? overviewSection.sideCard.image
                    : PLACEHOLDER_IMAGE,
            },
        },
        technicalRouteSection: {
            ...technicalRouteSection,
            title: withTextFallback(technicalRouteSection.title, LOREM_TITLE),
            segments: withListFallback(technicalRouteSection.segments, PLACEHOLDER_ROUTE_SEGMENTS),
        },
        placesVisitedSection: {
            ...placesVisitedSection,
            intro: withTextFallback(placesVisitedSection.intro, LOREM_SHORT),
            cards: withListFallback(placesVisitedSection.cards, PLACEHOLDER_PLACES_CARDS),
        },
        itinerarySection: {
            ...itinerarySection,
            days: withListFallback(itinerarySection.days, PLACEHOLDER_ITINERARY_DAYS),
        },
        stayAndDineSection: {
            ...stayAndDineSection,
            properties: withListFallback(stayAndDineSection.properties, PLACEHOLDER_STAY_PROPERTIES),
        },
        perksAndTechnicalsSection: {
            ...perksAndTechnicalsSection,
            items: withListFallback(perksAndTechnicalsSection.items, PLACEHOLDER_PERKS),
        },
        gallerySection: {
            ...gallerySection,
            media: withListFallback(gallerySection.media, PLACEHOLDER_GALLERY_MEDIA),
        },
    }
}
