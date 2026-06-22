/** Matches `public.bookings` insert/update payload in Supabase. */
export type CreateTourBookingDTO = {
    tour_id: string
    agency_id: string
    name: string
    email: string
    phone: string
    emergency_phone: string
    cnic: string
    male_seat: number
    female_seat: number
    kids_seats: number
    /** Stored as numeric/string in DB, e.g. `"9960.00"`. */
    amount_total: string
    notes?: string | null
    booking_payment_screenshot?: string | null
}

export type TourBookingRecord = CreateTourBookingDTO & {
    id: string
    created_at?: string
}
