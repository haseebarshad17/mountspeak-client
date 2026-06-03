import { buildBookingHref } from '@/components/pages/booking/booking.types'

export function buildBookingReturnPath(tourSlug?: string | null): string {
    return buildBookingHref(tourSlug ?? undefined)
}

export function buildLoginUrlForBooking(returnPath: string): string {
    const safePath = returnPath.startsWith('/') ? returnPath : '/booking'
    return `/login?next=${encodeURIComponent(safePath)}`
}

export function buildClientLoginUrlForBooking(): string {
    if (typeof window === 'undefined') {
        return '/login?next=%2Fbooking'
    }

    const returnPath = `${window.location.pathname}${window.location.search}`
    return buildLoginUrlForBooking(returnPath)
}
