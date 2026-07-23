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

export type PackageHotelLike = {
    label?: string | null
    hotel_name?: string | null
    hotel_rating?: string | null
    number_of_nights?: number | null
    room_type?: string | null
    distance_meters?: number | null
    distance_from_haram_meters?: number | null
    distance_from_masjid_e_nabawi_meters?: number | null
    image?: string | null
}

export type PackageRouteStopLike = {
    title?: string | null
    description?: string | null
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
        hotel?.distance_meters ??
        hotel?.distance_from_haram_meters ??
        hotel?.distance_from_masjid_e_nabawi_meters ??
        null
    const typeLabel = hotel?.label?.trim() || label

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
        type: typeLabel.toUpperCase(),
        name,
        thumbnail: resolvePackageMediaUrlOrPlaceholder(hotel?.image, mediaKind),
        description: details,
        amenities: [],
        rating: 0,
    }
}

/** @deprecated Prefer mapPackageHotelListToStaySection — kept for callers that still pass a pair. */
export function mapPackageHotelsToStaySection(
    makkahHotel?: PackageHotelLike | null,
    madinahHotel?: PackageHotelLike | null,
    mediaKind: PackageMediaKind = 'umrah',
    kind: Exclude<ListingKind, 'tour'> = 'umrah',
): TourPage['stayAndDineSection'] {
    return mapPackageHotelListToStaySection(
        [makkahHotel, madinahHotel],
        mediaKind,
        kind,
    )
}

export function mapPackageHotelListToStaySection(
    hotels: Array<PackageHotelLike | null | undefined> | null | undefined,
    mediaKind: PackageMediaKind = 'umrah',
    kind: Exclude<ListingKind, 'tour'> = 'umrah',
): TourPage['stayAndDineSection'] {
    const isUmrah = kind === 'umrah'
    const distanceSuffix = isUmrah ? 'from holy site' : 'from landmark'
    const fallbackLabels = isUmrah
        ? ['Makkah hotel', 'Madinah hotel']
        : ['Hotel', 'Hotel']

    const properties = (hotels ?? [])
        .map((hotel, index) =>
            mapHotelToStayProperty(
                `hotel-${index + 1}`,
                hotel?.label?.trim() || fallbackLabels[index] || `Hotel ${index + 1}`,
                hotel,
                mediaKind,
                distanceSuffix,
            ),
        )
        .filter((item): item is NonNullable<typeof item> => Boolean(item))

    return {
        id: 'stay-and-dine',
        title: 'Hotels',
        properties,
    }
}

/** @deprecated Prefer mapPackageRouteStopsToRouteSection */
export function mapPackageZiyaratToRouteSection(
    makkahDetails?: string | null,
    madinahDetails?: string | null,
    kind: Exclude<ListingKind, 'tour'> = 'umrah',
): TourPage['technicalRouteSection'] {
    const isUmrah = kind === 'umrah'
    return mapPackageRouteStopsToRouteSection(
        [
            makkahDetails?.trim()
                ? {
                      title: isUmrah ? 'Makkah ziyarat' : 'Outbound highlights',
                      description: makkahDetails,
                  }
                : null,
            madinahDetails?.trim()
                ? {
                      title: isUmrah ? 'Madinah ziyarat' : 'Return highlights',
                      description: madinahDetails,
                  }
                : null,
        ],
        kind,
    )
}

export function mapPackageRouteStopsToRouteSection(
    stops: Array<PackageRouteStopLike | null | undefined> | null | undefined,
    kind: Exclude<ListingKind, 'tour'> = 'umrah',
): TourPage['technicalRouteSection'] {
    const isUmrah = kind === 'umrah'
    const segments: TourPage['technicalRouteSection']['segments'] = (stops ?? [])
        .map((stop, index) => {
            const title = stop?.title?.trim() || ''
            const description = stop?.description?.trim() || ''
            if (!title && !description) return null

            return {
                segmentId: `route-stop-${index + 1}`,
                title: title || `Stop ${index + 1}`,
                description,
                distanceKm: 0,
                estimatedDuration: '',
                terrain: [],
            }
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item))

    return {
        id: 'technical-route',
        title: isUmrah ? 'Ziyarat route' : 'Tour route',
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
