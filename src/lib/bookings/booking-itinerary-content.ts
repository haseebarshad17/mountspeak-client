import {
    mapPackageHotelsToStaySection,
    mapPackageIncludesToPerks,
    mapPackageZiyaratToRouteSection,
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

type PackageHotelEmbed = {
    hotel_name?: string | null
    hotel_rating?: string | null
    number_of_nights?: number | null
    room_type?: string | null
    distance_from_haram_meters?: number | null
    distance_from_masjid_e_nabawi_meters?: number | null
} | null

type PackagePlanEmbed = {
    makkah_hotel?: PackageHotelEmbed
    madinah_hotel?: PackageHotelEmbed
    hotels?: {
        makkah_hotel?: PackageHotelEmbed
        madinah_hotel?: PackageHotelEmbed
    } | null
    ziyarat?: {
        makkah_ziyarat_details?: string | null
        madinah_ziyarat_details?: string | null
    } | null
    itinerary?: {
        makkah_ziyarat_details?: string | null
        madinah_ziyarat_details?: string | null
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

export function extractPackageItineraryContent(
    plan: PackagePlanEmbed,
    kind: Exclude<ListingKind, 'tour'>,
): BookingItineraryContent {
    const mediaKind = kind === 'umrah' ? 'umrah' : 'international'
    const makkahHotel = plan.makkah_hotel ?? plan.hotels?.makkah_hotel ?? null
    const madinahHotel = plan.madinah_hotel ?? plan.hotels?.madinah_hotel ?? null
    const ziyaratSource = plan.ziyarat ?? plan.itinerary ?? null

    const routeSection = mapPackageZiyaratToRouteSection(
        ziyaratSource?.makkah_ziyarat_details,
        ziyaratSource?.madinah_ziyarat_details,
        kind,
    )
    const staySection = mapPackageHotelsToStaySection(makkahHotel, madinahHotel, mediaKind, kind)
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
                .filter((property) => property.title || property.description),
        },
        services: {
            sectionTitle: kind === 'umrah' ? 'Package includes' : 'Services',
            items: serviceItems.map((item) => nonEmptyText(item.title)).filter(Boolean),
        },
    }
}
