import {
    getAvailableSeats,
    isTourBookingClosed,
} from '@/lib/booking/tour-booking-rules'
import type { BookingTourOption, BookingTourSlot } from '@/components/pages/booking/booking.types'
import { formatBookingSlotLabel } from '@/components/pages/booking/booking.types'

export type PublishedTourSlotRpc = {
    id: string
    start_date: string
    end_date: string
    start_time: string
    end_time: string
    capacity_total: number
    confirmed_seats: number
    available_seats: number
    is_bookable: boolean
}

export type PublishedTourRpc = {
    id: string
    agency_id: string
    slug: string
    title: string
    price_per_seat: number
    discount_percent: number | null
    kids_discount: number | null
    advance_amount_per_seat: number | null
    start_date: string | null
    end_date: string | null
    capacity_total: number | null
    confirmed_seats: number | null
    slots?: PublishedTourSlotRpc[] | null
}

function mapSlot(slot: PublishedTourSlotRpc): BookingTourSlot {
    const startDate = slot.start_date
    const endDate = slot.end_date
    const startTime = slot.start_time

    return {
        id: slot.id,
        startDate,
        endDate,
        startTime,
        endTime: slot.end_time,
        capacityTotal: Math.max(0, Number(slot.capacity_total ?? 0)),
        confirmedSeats: Math.max(0, Number(slot.confirmed_seats ?? 0)),
        availableSeats: Math.max(0, Number(slot.available_seats ?? 0)),
        isBookable: Boolean(slot.is_bookable),
        label: formatBookingSlotLabel({ startDate, endDate, startTime }),
    }
}

export function mapPublishedTourToBookingOption(row: PublishedTourRpc): BookingTourOption | null {
    if (row.price_per_seat == null || row.price_per_seat <= 0) return null

    const confirmedSeats = Math.max(0, row.confirmed_seats ?? 0)
    const slots = (row.slots ?? []).map(mapSlot)
    const hasSlots = slots.length > 0
    const bookableSlots = slots.filter((slot) => slot.isBookable && slot.availableSeats > 0)
    const selectedSlot = bookableSlots.length === 1 ? bookableSlots[0] : null
    const availableSeats =
        selectedSlot?.availableSeats ??
        (bookableSlots.length > 0
            ? Math.max(...bookableSlots.map((slot) => slot.availableSeats))
            : getAvailableSeats(row.capacity_total, confirmedSeats))

    const startDate =
        selectedSlot?.startDate ?? bookableSlots[0]?.startDate ?? row.start_date ?? null
    const isBookingClosed = hasSlots
        ? bookableSlots.length === 0
        : isTourBookingClosed(startDate)

    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        agencyId: row.agency_id ?? 'unassigned',
        pricePerSeat: Number(row.price_per_seat),
        advanceAmountPerSeat:
            row.advance_amount_per_seat != null && Number(row.advance_amount_per_seat) > 0
                ? Number(row.advance_amount_per_seat)
                : null,
        discountPercent: Number(row.discount_percent ?? 0),
        kidsDiscountPercent: Number(row.kids_discount ?? 0),
        startDate,
        capacityTotal: row.capacity_total ?? null,
        confirmedSeats,
        availableSeats,
        isBookingClosed,
        slots,
    }
}
