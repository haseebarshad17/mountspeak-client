import type { ListingKind } from '@/lib/homepage/specialization'

import type { TourPage } from '@/components/pages/tour/sections/tour-page.types'

export const PACKAGE_BOOKING_REQUEST_SECTION_ID = 'package-booking-request'

export const INTERNATIONAL_INQUIRY_PRIMARY_LABEL = 'Request Booking'
export const INTERNATIONAL_INQUIRY_SECTION_TITLE = 'Request a booking'
export const INTERNATIONAL_INQUIRY_SECTION_INTRO =
    'Submit your travel details and our team will contact you to confirm availability and next steps.'

export function isInquiryOnlyTourPage(
    page: Pick<TourPage, 'listingKind'>,
): boolean {
    return page.listingKind === 'international'
}

export function usesDomesticCheckout(listingKind: ListingKind | undefined): boolean {
    return !listingKind || listingKind === 'tour'
}

export function scrollToPackageBookingRequest() {
    const target = document.getElementById(PACKAGE_BOOKING_REQUEST_SECTION_ID)
    if (!target) return

    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.replaceState(null, '', `#${PACKAGE_BOOKING_REQUEST_SECTION_ID}`)
}

export function buildInternationalInquiryMessage(
    packageInquiry: TourPage['packageInquiry'],
    userMessage?: string,
): string | undefined {
    if (!packageInquiry) return userMessage?.trim() || undefined

    const prefix = `[International tour inquiry: ${packageInquiry.title} · Ref ${packageInquiry.packageId}]`
    const trimmed = userMessage?.trim()

    return trimmed ? `${prefix}\n\n${trimmed}` : prefix
}
