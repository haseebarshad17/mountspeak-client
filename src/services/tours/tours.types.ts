import type { TourCategory } from './tours.category'

export type { TourRecord } from './tours.payload.types'

export type TourPublicationStatus = 'PUBLISHED' | 'UNPUBLISHED'

export const TOUR_PUBLICATION_STATUS = {
    published: 'PUBLISHED',
    unpublished: 'UNPUBLISHED',
} as const satisfies Record<string, TourPublicationStatus>

/** Alias for Supabase row */
export type TourRow = import('./tours.payload.types').TourRecord

export type TourListDepartureSlot = {
    id: string
    startDate: string
    startTime: string
    availableSeats: number
    isBookable: boolean
}

export type TourListItem = {
    id: string
    slug: string
    title: string
    category: TourCategory | null
    discountLabel: string
    discountPercent: number | null
    pricePerSeat: number | null
    image: string
    totalBooked: number
    remainingSeats: number | null
    daysLeft: number | null
    departureDate: string | null
    departureSlots: TourListDepartureSlot[]
    isBookingClosed: boolean
}
