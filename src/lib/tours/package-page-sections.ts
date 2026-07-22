import type { TourPage } from '@/components/pages/tour/sections/tour-page.types'
import type { ListingKind } from '@/lib/homepage/specialization'
import { resolvePackageMediaUrlOrPlaceholder, type PackageMediaKind } from '@/lib/supabase/package-media'

export function createEmptyPackageTourSections(): Pick<
    TourPage,
    | 'technicalRouteSection'
    | 'placesVisitedSection'
    | 'itinerarySection'
    | 'stayAndDineSection'
> {
    return {
        technicalRouteSection: {
            id: 'technical-route',
            title: 'Route',
            background: 'light-card',
            segments: [],
        },
        placesVisitedSection: {
            id: 'places-visited',
            eyebrow: 'HIGHLIGHTS',
            title: 'Places to be visited',
            intro: '',
            cards: [],
        },
        itinerarySection: {
            id: 'itinerary',
            title: 'Day-by-Day Journey',
            timelineStyle: 'zigzag-cards',
            days: [],
        },
        stayAndDineSection: {
            id: 'stay-and-dine',
            title: 'Stay & Dine',
            properties: [],
        },
    }
}

type PackageHotelLike = {
    hotel_name?: string | null
    hotel_rating?: string | null
    number_of_nights?: number | null
    room_type?: string | null
    distance_from_haram_meters?: number | null
    distance_from_masjid_e_nabawi_meters?: number | null
    image?: string | null
}

function mapHotelToStayProperty(
    id: string,
    label: string,
    hotel: PackageHotelLike | null | undefined,
    mediaKind: PackageMediaKind,
    distanceSuffix = 'from holy site',
): TourPage['stayAndDineSection']['properties'][number] | null {
    const name = hotel?.hotel_name?.trim()
    if (!name) return null

    const nights = hotel?.number_of_nights
    const rating = hotel?.hotel_rating?.replace(/_/g, ' ') ?? ''
    const room = hotel?.room_type?.replace(/_/g, ' ') ?? ''
    const distance =
        hotel?.distance_from_haram_meters ?? hotel?.distance_from_masjid_e_nabawi_meters ?? null

    const details = [
        nights ? `${nights} night${nights === 1 ? '' : 's'}` : null,
        rating || null,
        room || null,
        distance != null ? `${distance}m ${distanceSuffix}` : null,
    ]
        .filter(Boolean)
        .join(' · ')

    return {
        id,
        type: label.toUpperCase(),
        name,
        thumbnail: resolvePackageMediaUrlOrPlaceholder(hotel?.image, mediaKind),
        description: details,
        amenities: [],
        rating: 0,
    }
}

export function mapPackageHotelsToStaySection(
    makkahHotel?: PackageHotelLike | null,
    madinahHotel?: PackageHotelLike | null,
    mediaKind: PackageMediaKind = 'umrah',
    kind: Exclude<ListingKind, 'tour'> = 'umrah',
): TourPage['stayAndDineSection'] {
    const isUmrah = kind === 'umrah'
    const labels = isUmrah
        ? {
              firstId: 'makkah-hotel',
              first: 'Makkah hotel',
              secondId: 'madinah-hotel',
              second: 'Madinah hotel',
              distanceSuffix: 'from holy site',
          }
        : {
              firstId: 'hotel-1',
              first: '',
              secondId: 'hotel-2',
              second: '',
              distanceSuffix: 'from landmark',
          }

    const properties = [
        mapHotelToStayProperty(
            labels.firstId,
            labels.first,
            makkahHotel,
            mediaKind,
            labels.distanceSuffix,
        ),
        mapHotelToStayProperty(
            labels.secondId,
            labels.second,
            madinahHotel,
            mediaKind,
            labels.distanceSuffix,
        ),
    ].filter((item): item is NonNullable<typeof item> => Boolean(item))

    return {
        id: 'stay-and-dine',
        title: 'Hotels',
        properties,
    }
}

export function mapPackageZiyaratToRouteSection(
    makkahDetails?: string | null,
    madinahDetails?: string | null,
    kind: Exclude<ListingKind, 'tour'> = 'umrah',
): TourPage['technicalRouteSection'] {
    const isUmrah = kind === 'umrah'
    const labels = isUmrah
        ? {
              title: 'Ziyarat route',
              first: 'Makkah ziyarat',
              second: 'Madinah ziyarat',
              firstId: 'makkah-ziyarat',
              secondId: 'madinah-ziyarat',
          }
        : {
              title: 'Tour route',
              first: 'Outbound highlights',
              second: 'Return highlights',
              firstId: 'outbound-route',
              secondId: 'return-route',
          }

    const segments: TourPage['technicalRouteSection']['segments'] = []

    if (makkahDetails?.trim()) {
        segments.push({
            segmentId: labels.firstId,
            title: labels.first,
            description: makkahDetails.trim(),
            distanceKm: 0,
            estimatedDuration: '',
            terrain: [],
        })
    }

    if (madinahDetails?.trim()) {
        segments.push({
            segmentId: labels.secondId,
            title: labels.second,
            description: madinahDetails.trim(),
            distanceKm: 0,
            estimatedDuration: '',
            terrain: [],
        })
    }

    return {
        id: 'technical-route',
        title: labels.title,
        background: 'light-card',
        segments,
    }
}

export function mapPackageIncludesToPerks(
    items: string[] | null | undefined,
): TourPage['perksAndTechnicalsSection']['items'] {
    return (items ?? [])
        .map((item) => item.trim())
        .filter(Boolean)
        .map((title) => ({
            icon: 'mountain-tools',
            title,
            description: '',
        }))
        .slice(0, 8)
}
