import type { TourSlot } from '@/services/listings/listings.types'

export type BookingTourOption = {
    id: string
    slug: string
    title: string
    agencyId: string
    pricePerSeat: number
    advanceAmountPerSeat: number | null
    discountPercent: number
    kidsDiscountPercent: number
    currency: string
    startDate: string | null
    capacityTotal: number | null
    confirmedSeats: number
    heroImageUrl: string | null
    slots: TourSlot[]
}
