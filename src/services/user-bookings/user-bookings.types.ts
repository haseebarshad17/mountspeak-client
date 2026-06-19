import type {
    TourHeaderPayload,
    TourOverviewPayload,
} from '@/services/tours/tours.payload.types'

export type UserBookingTourRow = {
    id: string
    slug: string | null
    title: string
    from_location: string | null
    to_location: string | null
    start_date: string | null
    end_date: string | null
    header: TourHeaderPayload | null
    overview: TourOverviewPayload | null
    visual_fragments: string[] | null
}

export type UserBookingRow = {
    id: string
    status: string | null
    created_at: string
    male_seat: number | null
    female_seat: number | null
    kids_seats: number | null
    booking_payment_screenshot: string | null
    tours: UserBookingTourRow | UserBookingTourRow[] | null
}

export type UserBookingStatusTone = 'confirmed' | 'action' | 'completed' | 'cancelled' | 'pending'

export type UserBookingDisplay = {
    id: string
    referenceId: string
    status: string
    statusTone: UserBookingStatusTone
    title: string
    image: string
    schedule: string
    location: string
    region: string
    dateLabel: string
    members: string
    memberCount: number
    warning: string
    slug: string | null
    primaryAction: string
    secondaryAction: string
    isPast: boolean
}

export type UserPastBookingDisplay = {
    status: string
    statusTone: 'completed' | 'cancelled'
    date: string
    title: string
    note: string
    action: string
}
