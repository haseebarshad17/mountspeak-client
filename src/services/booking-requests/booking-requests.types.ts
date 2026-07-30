export const BOOKING_REQUEST_CATEGORIES = [
    'FAMILY',
    'ADVENTURE',
    'HONEYMOON',
    'CORPORATE',
    'SELF',
    'GROUP',
] as const

export type BookingRequestCategory = (typeof BOOKING_REQUEST_CATEGORIES)[number]

export const BOOKING_REQUEST_CATEGORY_LABELS: Record<BookingRequestCategory, string> = {
    FAMILY: 'Family',
    ADVENTURE: 'Adventure',
    HONEYMOON: 'Honeymoon',
    CORPORATE: 'Corporate',
    SELF: 'Self',
    GROUP: 'Group',
}

export type CreateBookingRequestDTO = {
    full_name: string
    email: string
    phone: string
    travel_date: string
    destination: string
    male_seat: number
    female_seat: number
    child_seat: number
    category: BookingRequestCategory
    agency_id: string
    request_message?: string
    user_id?: string
    past_history?: string
    listing_kind?: 'umrah' | 'international' | null
    umrah_plan_id?: string
    international_tour_id?: string
}

export type BookingRequestRecord = CreateBookingRequestDTO & {
    id: string
    created_at?: string
}
