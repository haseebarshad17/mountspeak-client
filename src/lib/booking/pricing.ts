export function parseTourCalendarDate(value: string | null | undefined): Date | null {
    if (!value?.trim()) return null
    const datePart = value.trim().match(/^(\d{4}-\d{2}-\d{2})/)?.[1]
    if (datePart) {
        const parsed = new Date(`${datePart}T00:00:00`)
        return Number.isNaN(parsed.getTime()) ? null : parsed
    }
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return null
    parsed.setHours(0, 0, 0, 0)
    return parsed
}

export function isTourBookingClosed(startDate: string | null | undefined): boolean {
    const parsed = parseTourCalendarDate(startDate)
    if (!parsed) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return parsed.getTime() <= today.getTime()
}

export function formatSlotTime(value: string | null | undefined): string | null {
    if (!value?.trim()) return null
    const match = value.trim().match(/^(\d{1,2}):(\d{2})/)
    if (!match) return null
    let hours = Number(match[1])
    const minutes = match[2]
    if (!Number.isFinite(hours)) return null
    const suffix = hours >= 12 ? 'pm' : 'am'
    hours = hours % 12 || 12
    return `${hours}:${minutes} ${suffix}`
}

export function formatTourSlotLabel(slot: {
    startDate: string
    startTime?: string | null
    ended?: boolean
}): string {
    const date = parseTourCalendarDate(slot.startDate)
    const dateLabel = date
        ? date.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
          })
        : slot.startDate
    const timeLabel = formatSlotTime(slot.startTime)
    const base = timeLabel ? `${dateLabel} - ${timeLabel}` : dateLabel
    return slot.ended ? `${base} · Ended` : base
}

export function getAvailableSeats(
    capacityTotal: number | null | undefined,
    confirmedSeats: number
): number | null {
    if (capacityTotal == null || capacityTotal <= 0) return null
    return Math.max(0, capacityTotal - Math.max(0, confirmedSeats))
}

export function countBookingSeats(params: {
    maleSeats: number
    femaleSeats: number
    kidsSeats: number
}): number {
    return (
        Math.max(0, params.maleSeats) +
        Math.max(0, params.femaleSeats) +
        Math.max(0, params.kidsSeats)
    )
}

export function calculateBookingPriceBreakdown(params: {
    pricePerSeat: number
    discountPercent: number
    kidsDiscountPercent: number
    advanceAmountPerSeat: number | null
    maleSeats: number
    femaleSeats: number
    kidsSeats: number
}) {
    const adults = Math.max(0, params.maleSeats) + Math.max(0, params.femaleSeats)
    const kids = Math.max(0, params.kidsSeats)
    const adultUnit =
        params.pricePerSeat * (1 - Math.max(0, params.discountPercent) / 100)
    const kidsUnit =
        params.pricePerSeat * (1 - Math.max(0, params.kidsDiscountPercent) / 100)
    const totalAmount = adultUnit * adults + kidsUnit * kids
    const seats = adults + kids
    const advanceAmountDue =
        params.advanceAmountPerSeat != null && params.advanceAmountPerSeat > 0
            ? Math.min(params.advanceAmountPerSeat * seats, totalAmount)
            : totalAmount
    return {
        totalAmount,
        advanceAmountDue,
        balanceDue: Math.max(0, totalAmount - advanceAmountDue),
        seats,
    }
}
