import type { TourPublicationStatus } from './tours.types'

export type TourHeaderPayload = {
    tag: string
    title: string
    subtitle?: string
    hero_image_url: string
    day_count: number
    night_count: number
}

export type TourOverviewPayload = {
    title: string
    body: string
    elevation_m?: number
    difficulty?: string
    image_url?: string
}

export type TourHighlightPayload = {
    icon: string
    title: string
    description: string
}

export type TourRouteSegmentPayload = {
    title: string
    description: string
}

export type TourRoutePayload = {
    section_title: string
    segments: TourRouteSegmentPayload[]
}

export type TourPlaceVisitedPayload = {
    name: string
    location_label: string
    image_url: string
}

export type TourJourneyDayPayload = {
    day: number
    title: string
    description: string
    image_url: string
}

export type TourStayPayload = {
    category: string
    name: string
    description: string
    image_url: string
    amenities?: string[]
}

export type TourPerkPayload = {
    icon: string
    title: string
    description: string
}

/** Row shape returned from public.tours (nested JSON columns). */
export type TourRecord = {
    id: string
    slug: string
    title: string
    from_location: string | null
    to_location: string | null
    start_date: string | null
    end_date: string | null
    price_per_seat: number | null
    discount_percent: number | null
    /** Supabase column for child seat discount (ages 4–8). */
    kids_discount: number | null
    capacity_total: number | null
    confirmed_seats: number | null
    publication_status: TourPublicationStatus
    agency_id: string | null
    created_at: string
    header: TourHeaderPayload | null
    overview: TourOverviewPayload | null
    highlights: TourHighlightPayload[] | null
    route: TourRoutePayload | null
    places_visited: TourPlaceVisitedPayload[] | null
    journey: TourJourneyDayPayload[] | null
    stay_and_dine: TourStayPayload[] | null
    expedition_perks: TourPerkPayload[] | null
    visual_fragments: string[] | null
}
