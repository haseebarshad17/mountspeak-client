import { MessageCode } from '@/lib/messages/codes'

export const BOOKING_CLOSED_MESSAGE = MessageCode.BOOKING_CLOSED
export const BOOKING_SOLD_OUT_MESSAGE = MessageCode.BOOKING_SOLD_OUT

export type SeatCapacityError = {
    code: typeof MessageCode.BOOKING_SEATS_AVAILABLE_ONE | typeof MessageCode.BOOKING_SEATS_AVAILABLE_MANY
    params?: { count: number }
}

export function isTourBookingClosed(startDate: string | null | undefined): boolean {
    if (!startDate?.trim()) return false

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const parsed = new Date(`${startDate.trim()}T00:00:00`)
    if (Number.isNaN(parsed.getTime())) return false

    return parsed <= today
}

export function getAvailableSeats(
    capacityTotal: number | null | undefined,
    confirmedSeats: number,
): number | null {
    if (capacityTotal == null || capacityTotal <= 0) return null
    return Math.max(0, capacityTotal - Math.max(0, confirmedSeats))
}

export function countBookingSeats(params: {
    maleSeats: number
    femaleSeats: number
    kidsSeats: number
}): number {
    return Math.max(0, params.maleSeats) + Math.max(0, params.femaleSeats) + Math.max(0, params.kidsSeats)
}

export function validateSeatCapacity(params: {
    maleSeats: number
    femaleSeats: number
    kidsSeats: number
    availableSeats: number | null
}): SeatCapacityError | null {
    const requested = countBookingSeats(params)

    if (requested <= 0) return null
    if (params.availableSeats == null) return null

    if (requested > params.availableSeats) {
        const available = params.availableSeats
        if (available === 1) {
            return { code: MessageCode.BOOKING_SEATS_AVAILABLE_ONE }
        }

        return {
            code: MessageCode.BOOKING_SEATS_AVAILABLE_MANY,
            params: { count: available },
        }
    }

    return null
}

export function isTourBookable(params: {
    startDate: string | null | undefined
    availableSeats: number | null
}): boolean {
    if (isTourBookingClosed(params.startDate)) return false
    if (params.availableSeats != null && params.availableSeats <= 0) return false
    return true
}
