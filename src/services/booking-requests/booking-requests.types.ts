export const BOOKING_REQUEST_CATEGORIES = [
    'FAMILY',
    'ADVENTURE',
    'HONEYMOON',
    'CORPORATE',
    'SOLO',
    'GROUP',
] as const

export type BookingRequestCategory = (typeof BOOKING_REQUEST_CATEGORIES)[number]

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
    request_message?: string
    agency_id?: string
}

export type BookingRequestRecord = CreateBookingRequestDTO & {
    id: string
    created_at?: string
}
