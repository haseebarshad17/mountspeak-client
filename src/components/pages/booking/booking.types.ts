export type BookingTourSlot = {
    id: string
    startDate: string
    endDate: string
    startTime: string
    endTime: string
    capacityTotal: number
    confirmedSeats: number
    availableSeats: number
    isBookable: boolean
    label: string
}

export type BookingTourOption = {
    id: string
    slug: string
    title: string
    agencyId: string
    pricePerSeat: number
    advanceAmountPerSeat: number | null
    discountPercent: number
    /** From `tours.kids_discount` — percent off kids seats only (ages 4–8). */
    kidsDiscountPercent: number
    startDate: string | null
    capacityTotal: number | null
    confirmedSeats: number
    availableSeats: number | null
    isBookingClosed: boolean
    slots: BookingTourSlot[]
}

/** Prefer `lockedTour` when it matches the selected id — it includes RPC slot data. */
export function resolveSelectedBookingTour(
    lockedTour: BookingTourOption | null,
    tourId: string,
    tourOptions: BookingTourOption[],
): BookingTourOption | null {
    const id = lockedTour?.id ?? tourId
    if (!id) return lockedTour

    if (lockedTour && lockedTour.id === id) return lockedTour

    return tourOptions.find((tour) => tour.id === id) ?? lockedTour ?? null
}

export type BookingDetailsForm = {
    firstName: string
    lastName: string
    phone: string
    emergencyPhone: string
    cnic: string
    tourId: string
    slotId: string
    maleSeats: number
    femaleSeats: number
    kidsSeats: number
    note: string
}

export type BookingPaymentForm = {
    paymentScreenshot: File | null
    idCardFront: File | null
    idCardBack: File | null
}

export type BookingFormState = BookingDetailsForm & BookingPaymentForm & {
    totalAmount: number
    advanceAmountDue: number
    balanceDue: number
}

export function buildBookingHref(tourSlug?: string, slotId?: string): string {
    if (!tourSlug?.trim()) return '/booking'

    const params = new URLSearchParams({ tour: tourSlug.trim() })
    if (slotId?.trim()) {
        params.set('slot', slotId.trim())
    }

    return `/booking?${params.toString()}`
}

export type BookingPriceBreakdown = {
    subtotal: number
    discountAmount: number
    total: number
    adultSubtotal: number
    adultDiscount: number
    kidsSubtotal: number
    kidsDiscount: number
    advanceDue: number
    balanceDue: number
}

export function calculateBookingPriceBreakdown(params: {
    adultSeats: number
    kidsSeats: number
    pricePerSeat: number
    discountPercent: number
    kidsDiscountPercent: number
    advanceAmountPerSeat?: number | null
}): BookingPriceBreakdown {
    const { adultSeats, kidsSeats, pricePerSeat, discountPercent, kidsDiscountPercent, advanceAmountPerSeat } = params

    if (pricePerSeat <= 0) {
        return {
            subtotal: 0,
            discountAmount: 0,
            total: 0,
            adultSubtotal: 0,
            adultDiscount: 0,
            kidsSubtotal: 0,
            kidsDiscount: 0,
            advanceDue: 0,
            balanceDue: 0,
        }
    }

    const adultSubtotal = pricePerSeat * Math.max(0, adultSeats)
    const adultDiscount = (discountPercent / 100) * adultSubtotal
    const adultTotal = adultSubtotal - adultDiscount

    const kidsSubtotal = pricePerSeat * Math.max(0, kidsSeats)
    const kidsDiscount = (kidsDiscountPercent / 100) * kidsSubtotal
    const kidsTotal = kidsSubtotal - kidsDiscount

    const subtotal = adultSubtotal + kidsSubtotal
    const discountAmount = adultDiscount + kidsDiscount
    const total = Math.round(adultTotal + kidsTotal)
    const totalSeats = Math.max(0, adultSeats) + Math.max(0, kidsSeats)

    const advanceDue = calculateBookingAdvanceDue(total, totalSeats, advanceAmountPerSeat ?? null)

    return {
        subtotal: Math.round(subtotal),
        discountAmount: Math.round(discountAmount),
        total,
        adultSubtotal: Math.round(adultSubtotal),
        adultDiscount: Math.round(adultDiscount),
        kidsSubtotal: Math.round(kidsSubtotal),
        kidsDiscount: Math.round(kidsDiscount),
        advanceDue: advanceDue.advanceDue,
        balanceDue: advanceDue.balanceDue,
    }
}

export function calculateBookingAdvanceDue(
    totalAmount: number,
    totalSeats: number,
    advanceAmountPerSeat: number | null,
): { advanceDue: number; balanceDue: number } {
    const total = Math.max(0, Math.round(totalAmount))
    const seats = Math.max(0, totalSeats)

    if (!advanceAmountPerSeat || advanceAmountPerSeat <= 0 || seats <= 0) {
        return { advanceDue: total, balanceDue: 0 }
    }

    const advanceDue = Math.min(Math.round(advanceAmountPerSeat * seats), total)

    return {
        advanceDue,
        balanceDue: Math.max(total - advanceDue, 0),
    }
}

export function calculateBookingTotalAmount(
    params: Parameters<typeof calculateBookingPriceBreakdown>[0],
): number {
    return calculateBookingPriceBreakdown(params).total
}

export function formatBookingTotalAmount(amount: number): string {
    return `PKR ${amount.toLocaleString('en-PK')}`
}

export function formatBookingDiscountAmount(amount: number): string {
    if (amount <= 0) return formatBookingTotalAmount(0)
    return `-${formatBookingTotalAmount(amount)}`
}

export function formatBookingSlotSeatSummary(
    params: Pick<BookingTourSlot, 'capacityTotal' | 'confirmedSeats' | 'availableSeats'>,
): string {
    const capacity = Math.max(0, params.capacityTotal)
    const booked = Math.max(0, params.confirmedSeats)
    const available = Math.max(0, params.availableSeats)

    if (capacity > 0) {
        return `${booked} booked · ${available} of ${capacity} seats left`
    }

    return `${booked} booked · ${available} seat${available === 1 ? '' : 's'} left`
}

export function getTourDepartureSlots(tour: Pick<BookingTourOption, 'slots'>): BookingTourSlot[] {
    return [...tour.slots].sort((left, right) => {
        const leftKey = `${left.startDate}T${left.startTime || '00:00'}`
        const rightKey = `${right.startDate}T${right.startTime || '00:00'}`
        return leftKey.localeCompare(rightKey)
    })
}

export function getBookableTourSlots(tour: Pick<BookingTourOption, 'slots'>): BookingTourSlot[] {
    return getTourDepartureSlots(tour).filter((slot) => slot.isBookable && slot.availableSeats > 0)
}

export function formatBookingSlotOptionLabel(slot: BookingTourSlot): string {
    const dateLabel = slot.label || formatBookingSlotLabel(slot)
    const availability = formatBookingSlotSeatSummary(slot)

    if (!slot.isBookable || slot.availableSeats <= 0) {
        return `${dateLabel} — ${availability} (Unavailable)`
    }

    return `${dateLabel} — ${availability}`
}

export function formatTourSeatSummary(
    tour: Pick<BookingTourOption, 'capacityTotal' | 'confirmedSeats' | 'availableSeats'>,
): string | null {
    if (tour.availableSeats == null) return null

    return formatBookingSlotSeatSummary({
        capacityTotal: tour.capacityTotal ?? 0,
        confirmedSeats: tour.confirmedSeats,
        availableSeats: tour.availableSeats,
    })
}

export function resolveSelectedBookingSlot(
    tour: BookingTourOption,
    slotId: string,
): BookingTourSlot | null {
    const departures = getTourDepartureSlots(tour)

    if (slotId) {
        return departures.find((entry) => entry.id === slotId) ?? null
    }

    return departures.length === 1 ? departures[0] : null
}

export function formatBookingSlotLabel(slot: Pick<BookingTourSlot, 'startDate' | 'endDate' | 'startTime'>): string {
    const start = new Date(`${slot.startDate}T${slot.startTime || '00:00'}:00`)
    const end = new Date(`${slot.endDate}T00:00:00`)

    const startLabel = start.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
    const endLabel = end.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })

    const timeLabel = slot.startTime
        ? start.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true })
        : null

    if (startLabel === endLabel) {
        return timeLabel ? `${startLabel} · ${timeLabel}` : startLabel
    }

    return `${startLabel} – ${endLabel}`
}

export function resolveSelectedSlotAvailableSeats(
    tour: BookingTourOption,
    slotId: string,
): number | null {
    const selected = resolveSelectedBookingSlot(tour, slotId)
    if (selected) {
        return selected.availableSeats
    }

    if (getTourDepartureSlots(tour).length > 0) {
        return null
    }

    return tour.availableSeats
}
