export type BookingTourOption = {
    id: string
    slug: string
    title: string
    agencyId: string
    pricePerSeat: number
    discountPercent: number
    /** From `tours.kids_discount` — percent off kids seats only (ages 4–8). */
    kidsDiscountPercent: number
    startDate: string | null
    capacityTotal: number | null
    confirmedSeats: number
    availableSeats: number | null
    isBookingClosed: boolean
}

export type BookingDetailsForm = {
    firstName: string
    lastName: string
    phone: string
    emergencyPhone: string
    cnic: string
    tourId: string
    maleSeats: number
    femaleSeats: number
    kidsSeats: number
    note: string
}

export type BookingPaymentForm = {
    paymentScreenshot: File | null
}

export type BookingFormState = BookingDetailsForm & BookingPaymentForm & {
    totalAmount: number
}

export function buildBookingHref(tourSlug?: string): string {
    if (!tourSlug?.trim()) return '/booking'
    return `/booking?tour=${encodeURIComponent(tourSlug.trim())}`
}

export type BookingPriceBreakdown = {
    subtotal: number
    discountAmount: number
    total: number
    adultSubtotal: number
    adultDiscount: number
    kidsSubtotal: number
    kidsDiscount: number
}

export function calculateBookingPriceBreakdown(params: {
    adultSeats: number
    kidsSeats: number
    pricePerSeat: number
    discountPercent: number
    kidsDiscountPercent: number
}): BookingPriceBreakdown {
    const { adultSeats, kidsSeats, pricePerSeat, discountPercent, kidsDiscountPercent } = params

    if (pricePerSeat <= 0) {
        return {
            subtotal: 0,
            discountAmount: 0,
            total: 0,
            adultSubtotal: 0,
            adultDiscount: 0,
            kidsSubtotal: 0,
            kidsDiscount: 0,
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

    return {
        subtotal: Math.round(subtotal),
        discountAmount: Math.round(discountAmount),
        total: Math.round(adultTotal + kidsTotal),
        adultSubtotal: Math.round(adultSubtotal),
        adultDiscount: Math.round(adultDiscount),
        kidsSubtotal: Math.round(kidsSubtotal),
        kidsDiscount: Math.round(kidsDiscount),
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
