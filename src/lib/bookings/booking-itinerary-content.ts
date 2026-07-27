import {
    mapPackageHotelListToStaySection,
    mapPackageIncludesToPerks,
    mapPackageRouteStopsToRouteSection,
    type PackageHotelLike,
    type PackageRouteStopLike,
} from '@/lib/tours/package-page-sections'
import type { ListingKind } from '@/lib/homepage/specialization'
import type {
    TourPerkPayload,
    TourRoutePayload,
    TourStayPayload,
} from '@/services/tours/tours.payload.types'

export type BookingItineraryRouteItem = {
    title: string
    description: string
}

export type BookingItineraryStayItem = {
    title: string
    subtitle: string
    description: string
}

export type BookingItineraryContent = {
    routes: {
        sectionTitle: string
        items: BookingItineraryRouteItem[]
    }
    stayAndDine: {
        sectionTitle: string
        items: BookingItineraryStayItem[]
    }
    services: {
        sectionTitle: string
        items: string[]
    }
}

export const EMPTY_BOOKING_ITINERARY_CONTENT: BookingItineraryContent = {
    routes: { sectionTitle: 'Route', items: [] },
    stayAndDine: { sectionTitle: 'Stay & Dine', items: [] },
    services: { sectionTitle: 'Services', items: [] },
}

type PackagePlanEmbed = {
    makkah_hotel?: PackageHotelLike | null
    madinah_hotel?: PackageHotelLike | null
    hotels?: {
        makkah_hotel?: PackageHotelLike | null
        madinah_hotel?: PackageHotelLike | null
        items?: PackageHotelLike[] | null
    } | null
    ziyarat?: {
        makkah_ziyarat_details?: string | null
        madinah_ziyarat_details?: string | null
        stops?: PackageRouteStopLike[] | null
        hotels?: PackageHotelLike[] | null
    } | null
    itinerary?: {
        makkah_ziyarat_details?: string | null
        madinah_ziyarat_details?: string | null
        stops?: PackageRouteStopLike[] | null
    } | null
    package_includes?: {
        items?: string[] | null
    } | null
}

function nonEmptyText(value: string | null | undefined): string {
    return value?.trim() ?? ''
}

function mapRouteSegments(route: TourRoutePayload | null | undefined): BookingItineraryRouteItem[] {
    return (route?.segments ?? [])
        .map((segment) => ({
            title: nonEmptyText(segment.title),
            description: nonEmptyText(segment.description),
        }))
        .filter((segment) => segment.title || segment.description)
}

function mapStayItems(stays: TourStayPayload[] | null | undefined): BookingItineraryStayItem[] {
    return (stays ?? [])
        .map((stay) => ({
            title: nonEmptyText(stay.name),
            subtitle: nonEmptyText(stay.category),
            description: nonEmptyText(stay.description),
        }))
        .filter((stay) => stay.title || stay.description)
}

function mapServiceItems(perks: TourPerkPayload[] | null | undefined): string[] {
    return (perks ?? [])
        .map((perk) => {
            const title = nonEmptyText(perk.title)
            const description = nonEmptyText(perk.description)
            if (title && description) return `${title} — ${description}`
            return title || description
        })
        .filter(Boolean)
}

export function extractDomesticTourItineraryContent(input: {
    route?: TourRoutePayload | null
    stay_and_dine?: TourStayPayload[] | null
    expedition_perks?: TourPerkPayload[] | null
}): BookingItineraryContent {
    return {
        routes: {
            sectionTitle: nonEmptyText(input.route?.section_title) || 'Route',
            items: mapRouteSegments(input.route),
        },
        stayAndDine: {
            sectionTitle: 'Stay & Dine',
            items: mapStayItems(input.stay_and_dine),
        },
        services: {
            sectionTitle: 'Services',
            items: mapServiceItems(input.expedition_perks),
        },
    }
}

function resolveEmbeddedHotels(plan: PackagePlanEmbed): PackageHotelLike[] {
    if (Array.isArray(plan.ziyarat?.hotels) && plan.ziyarat.hotels.length > 0) {
        return plan.ziyarat.hotels
    }
    if (Array.isArray(plan.hotels?.items) && plan.hotels.items.length > 0) {
        return plan.hotels.items
    }
    return [
        plan.makkah_hotel ?? plan.hotels?.makkah_hotel ?? null,
        plan.madinah_hotel ?? plan.hotels?.madinah_hotel ?? null,
    ].filter((hotel): hotel is PackageHotelLike => Boolean(hotel?.hotel_name?.trim()))
}

function resolveEmbeddedRouteStops(
    plan: PackagePlanEmbed,
    kind: Exclude<ListingKind, 'tour'>,
): PackageRouteStopLike[] {
    const source = plan.ziyarat ?? plan.itinerary ?? null
    if (Array.isArray(source?.stops) && source.stops.some((s) => s?.title?.trim() || s?.description?.trim())) {
        return source.stops
    }
    const isUmrah = kind === 'umrah'
    const legacy: PackageRouteStopLike[] = []
    if (source?.makkah_ziyarat_details?.trim()) {
        legacy.push({
            title: isUmrah ? 'Makkah ziyarat' : 'Outbound highlights',
            description: source.makkah_ziyarat_details,
        })
    }
    if (source?.madinah_ziyarat_details?.trim()) {
        legacy.push({
            title: isUmrah ? 'Madinah ziyarat' : 'Return highlights',
            description: source.madinah_ziyarat_details,
        })
    }
    return legacy
}

export function extractPackageItineraryContent(
    plan: PackagePlanEmbed,
    kind: Exclude<ListingKind, 'tour'>,
): BookingItineraryContent {
    const mediaKind = kind === 'umrah' ? 'umrah' : 'international'
    const routeSection = mapPackageRouteStopsToRouteSection(resolveEmbeddedRouteStops(plan, kind), kind)
    const staySection = mapPackageHotelListToStaySection(resolveEmbeddedHotels(plan), mediaKind, kind)
    const serviceItems = mapPackageIncludesToPerks(plan.package_includes?.items)

    return {
        routes: {
            sectionTitle: routeSection.title,
            items: routeSection.segments
                .map((segment) => ({
                    title: nonEmptyText(segment.title),
                    description: nonEmptyText(segment.description),
                }))
                .filter((segment) => segment.title || segment.description),
        },
        stayAndDine: {
            sectionTitle: staySection.title,
            items: staySection.properties
                .map((property) => ({
                    title: nonEmptyText(property.name),
                    subtitle: nonEmptyText(property.type),
                    description: nonEmptyText(property.description),
                }))
                .filter((item) => item.title || item.description),
        },
        services: {
            sectionTitle: 'Services',
            items: serviceItems.map((item) => item.title).filter(Boolean),
        },
    }
}
