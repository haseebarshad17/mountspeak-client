import { buildBookingHref } from '@/components/pages/booking/booking.types'
import type { ListingKind } from '@/lib/homepage/specialization'
import { buildPackageBookingHref } from '@/services/packages/package-booking.mapper'

export function buildBookingReturnPath(
    tourSlug?: string | null,
    slotId?: string | null,
    listingKind?: ListingKind | null,
    packageId?: string | null,
): string {
    if (
        (listingKind === 'umrah' || listingKind === 'international') &&
        packageId?.trim()
    ) {
        return buildPackageBookingHref(listingKind, packageId.trim())
    }

    return buildBookingHref(tourSlug ?? undefined, slotId ?? undefined)
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
