export type UserBookingTourRow = {
    id: string
    slug: string | null
    title: string
    from_location: string | null
    to_location: string | null
    start_date: string | null
    end_date: string | null
    header: {
        hero_image_url?: string
        title?: string
    } | null
    overview: {
        image_url?: string
    } | null
    visual_fragments: string[] | null
}

export type UserBookingPaymentRow = {
    status: string | null
}

export type UserBookingRow = {
    id: string
    status: string | null
    created_at: string
    male_seat: number | null
    female_seat: number | null
    kids_seats: number | null
    booking_payment_screenshot: string | null
    payment_id: string | null
    payment: UserBookingPaymentRow | UserBookingPaymentRow[] | null
    tours: UserBookingTourRow | UserBookingTourRow[] | null
}

export type UserBookingStatusTone =
    | 'confirmed'
    | 'action'
    | 'completed'
    | 'cancelled'
    | 'pending'

export type UserBookingDisplay = {
    id: string
    referenceId: string
    status: string
    statusTone: UserBookingStatusTone
    title: string
    image: string
    schedule: string
    location: string
    members: string
    warning: string
    slug: string | null
    isPast: boolean
}

export type UserPastBookingDisplay = {
    id: string
    status: string
    statusTone: 'completed' | 'cancelled'
    date: string
    title: string
    note: string
    slug: string | null
}

export type UserBookingsResult = {
    upcoming: UserBookingDisplay[]
    past: UserPastBookingDisplay[]
}
