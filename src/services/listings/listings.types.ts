import type { SpecializationKind } from '@/services/specialization/specialization.types'

export type ListingItem = {
    id: string
    kind: SpecializationKind
    title: string
    location: string
    priceLabel: string
    imageUrl: string | null
    href: string
    summary?: string | null
    badge?: string | null
    meta?: string | null
    durationLabel?: string | null
    ratingLabel?: string | null
    reviewCount?: number | null
    featured?: boolean
    departureDate?: string | null
    travelersCapacity?: number | null
    /** 0–100; when set with originalPriceLabel, card shows strikethrough + % off */
    discountPercent?: number | null
    originalPriceLabel?: string | null
    seatsLeft?: number | null
    tripTypeLabel?: string | null
}

export type ListingSearchFilters = {
    kind?: SpecializationKind
    destination?: string | null
    departureDate?: string | null
    travelers?: number | null
    featuredOnly?: boolean
    limit?: number
}

export type TourHighlight = {
    icon?: string
    title: string
    description?: string
}

export type TourRouteSegment = {
    title: string
    description?: string
}

export type TourPlace = {
    name: string
    image_url?: string
    location_label?: string
}

export type TourJourneyDay = {
    day: number
    title: string
    image_url?: string
    description?: string
}

export type TourStay = {
    name: string
    category?: string
    amenities?: string[]
    image_url?: string
    description?: string
}

export type TourPerk = {
    icon?: string
    title: string
    description?: string
}

export type TourRow = {
    id: string
    agency_id: string
    title: string
    start_date: string | null
    end_date: string | null
    price_per_seat: number | null
    capacity_total: number | null
    publication_status: string | null
    from_location: string | null
    to_location: string | null
    discount_percent: number | null
    slug: string | null
    header: {
        tag?: string
        title?: string
        subtitle?: string
        day_count?: number
        night_count?: number
        hero_image_url?: string
    } | null
    overview?: {
        body?: string
        title?: string
        image_url?: string
        difficulty?: string
        elevation_m?: number
    } | null
    highlights?: TourHighlight[] | null
    route?: {
        segments?: TourRouteSegment[]
        section_title?: string
    } | null
    places_visited?: TourPlace[] | null
    journey?: TourJourneyDay[] | null
    stay_and_dine?: TourStay[] | null
    expedition_perks?: TourPerk[] | null
    visual_fragments?: string[] | null
    kids_discount?: number | null
    confirmed_seats?: number | null
    category?: string | null
    advance_amount_per_seat?: number | null
}

export type TourDetail = {
    id: string
    agencyId: string
    slug: string
    title: string
    tag: string | null
    subtitle: string | null
    heroImageUrl: string | null
    overviewImageUrl: string | null
    overviewTitle: string | null
    overviewBody: string | null
    difficulty: string | null
    elevationM: number | null
    dayCount: number | null
    nightCount: number | null
    location: string
    fromLocation: string | null
    toLocation: string | null
    priceLabel: string
    priceAmount: number | null
    pricePerSeat: number
    discountPercent: number
    kidsDiscountPercent: number
    advanceAmountPerSeat: number | null
    startDate: string | null
    endDate: string | null
    capacityTotal: number | null
    confirmedSeats: number | null
    highlights: TourHighlight[]
    routeTitle: string | null
    routeSegments: TourRouteSegment[]
    places: Array<TourPlace & { imageUrl: string | null }>
    journey: Array<TourJourneyDay & { imageUrl: string | null }>
    stays: Array<TourStay & { imageUrl: string | null }>
    perks: TourPerk[]
    gallery: string[]
}

export type UmrahPlanRow = {
    id: string
    agency_id: string
    basic_information: {
        package_type?: string
        package_title?: string
        package_status?: string
        featured_package?: boolean
        package_category?: string
    } | null
    pricing: {
        currency?: string
        discount_price?: number
        original_price?: number
    } | null
    duration_dates: {
        return_date?: string
        duration_days?: number
        departure_date?: string
    } | null
    descriptions: {
        short_description?: string
        detailed_description?: string
    } | null
    images: {
        featured_image?: string
        gallery_images?: string[]
    } | null
    booking_info: {
        total_seats?: number
        available_seats?: number
        booking_deadline?: string
    } | null
    makkah_hotel?: { hotel_name?: string } | null
    madinah_hotel?: { hotel_name?: string } | null
}

export type InternationalTourRow = {
    id: string
    agency_id: string
    basic_information: {
        package_type?: string
        package_title?: string
        package_status?: string
        featured_package?: boolean
        package_category?: string
    } | null
    pricing: {
        currency?: string
        discount_price?: number
        original_price?: number
    } | null
    duration_dates: {
        return_date?: string
        duration_days?: number
        departure_date?: string
    } | null
    descriptions: {
        short_description?: string
        detailed_description?: string
    } | null
    images: {
        featured_image?: string
        gallery_images?: string[]
    } | null
    booking_info: {
        total_seats?: number
        available_seats?: number
        booking_deadline?: string
    } | null
}
