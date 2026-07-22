import type { ListingKind } from '@/lib/homepage/specialization'

import type { TourPage } from '@/components/pages/tour/sections/tour-page.types'

export const PACKAGE_BOOKING_REQUEST_SECTION_ID = 'package-booking-request'

export const INTERNATIONAL_INQUIRY_PRIMARY_LABEL = 'Request Booking'
export const INTERNATIONAL_INQUIRY_SECTION_TITLE = 'Request a booking'
export const INTERNATIONAL_INQUIRY_SECTION_INTRO =
    'Submit your travel details and our team will contact you to confirm availability and next steps.'

export function isInquiryOnlyTourPage(
    page?: Pick<TourPage, 'listingKind'>,
): boolean {
    return page?.listingKind === 'umrah' || page?.listingKind === 'international'
}

export function usesDomesticCheckout(listingKind: ListingKind | undefined): boolean {
    return !listingKind || listingKind === 'tour'
}

/** Reserved for a later checkout switch; packages use booking requests for now. */
export function usesPackageCheckout(listingKind: ListingKind | undefined): boolean {
    void listingKind
    return false
}

export function scrollToPackageBookingRequest() {
    const target = document.getElementById(PACKAGE_BOOKING_REQUEST_SECTION_ID)
    if (!target) return

    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.replaceState(null, '', `#${PACKAGE_BOOKING_REQUEST_SECTION_ID}`)
}

export function buildInternationalInquiryMessage(
    _packageInquiry: TourPage['packageInquiry'],
    userMessage?: string,
    _listingKind: TourPage['listingKind'] = 'international',
): string | undefined {
    void _packageInquiry
    void _listingKind
    // Package identity is stored via listing_kind + umrah_plan_id / international_tour_id.
    return userMessage?.trim() || undefined
}
