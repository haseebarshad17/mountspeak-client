import type { CreateTourBookingDTO } from './tour-bookings.types'

export const BOOKINGS_RETURN_COLUMNS = 'id, created_at'

export function formatBookingAmountTotal(amount: number): string {
    return amount.toFixed(2)
}

/** Maps form data to the live `public.bookings` row shape. */
export function toBookingsInsertRow(payload: CreateTourBookingDTO): Record<string, string | number | null> {
    return {
        tour_id: payload.tour_id,
        agency_id: payload.agency_id,
        name: payload.name.trim(),
        email: payload.email.trim(),
        phone: payload.phone.trim(),
        emergency_phone: payload.emergency_phone.trim(),
        cnic: payload.cnic.trim(),
        male_seat: payload.male_seat,
        female_seat: payload.female_seat,
        kids_seats: payload.kids_seats,
        amount_total: payload.amount_total,
        notes: payload.notes?.trim() || null,
        booking_payment_screenshot: payload.booking_payment_screenshot ?? null,
    }
}

export function buildCreateBookingPayload(params: {
    tourId: string
    agencyId: string
    name: string
    email: string
    phone: string
    emergencyPhone: string
    cnic: string
    maleSeats: number
    femaleSeats: number
    kidsSeats: number
    totalAmount: number
    notes?: string
}): CreateTourBookingDTO {
    return {
        tour_id: params.tourId,
        agency_id: params.agencyId,
        name: params.name,
        email: params.email,
        phone: params.phone,
        emergency_phone: params.emergencyPhone,
        cnic: params.cnic,
        male_seat: params.maleSeats,
        female_seat: params.femaleSeats,
        kids_seats: params.kidsSeats,
        amount_total: formatBookingAmountTotal(params.totalAmount),
        notes: params.notes?.trim() || null,
        booking_payment_screenshot: null,
    }
}
