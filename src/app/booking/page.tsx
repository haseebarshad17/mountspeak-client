import BookingPage from '@/components/pages/booking/BookingPage'
import { buildBookingReturnPath } from '@/lib/auth/booking-auth'
import { redirectWithAgencyPreview } from '@/lib/auth/preview-redirect'
import { buildPageMetadata } from '@/lib/homepage/build-page-metadata'
import { createServerSupabase } from '@/lib/supabase/supabase.server'
import { resolveBookingEmailBrandingFromHomepage } from '@/services/email/email-branding'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'
import {
    fetchBookingPackageById,
    fetchBookingTourBySlug,
    fetchPublishedToursForBooking,
} from '@/services/tours/tours.server'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
    const homepage = await fetchAgencyHomepage()

    return await buildPageMetadata({
        pageTitle: 'Booking',
        description: 'Begin your journey with us — partner booking and registration.',
        homepage,
    })
}

type BookingRoutePageProps = {
    searchParams: Promise<{
        tour?: string
        slot?: string
        kind?: string
        id?: string
    }>
}

function resolvePackageKind(kind: string | undefined): 'umrah' | 'international' | null {
    if (kind === 'umrah' || kind === 'international') return kind
    return null
}

export default async function Page({ searchParams }: BookingRoutePageProps) {
    const {
        tour: tourSlug,
        slot: slotId,
        kind: kindParam,
        id: packageId,
    } = await searchParams
    const packageKind = resolvePackageKind(kindParam?.trim())
    const returnPath = buildBookingReturnPath(
        tourSlug,
        slotId,
        packageKind,
        packageId,
    )
    const agencyHomepage = await fetchAgencyHomepage()
    const isAgencySite = agencyHomepage.isAgencySite

    if (isAgencySite) {
        const supabase = await createServerSupabase()
        const { data: authData } = await supabase.auth.getUser()

        // Guests may book after email OTP on the form. Logged-in staff of this
        // agency are still blocked from the customer booking flow.
        if (authData.user) {
            const { data: canAccess, error: accessError } = await supabase.rpc(
                'can_access_agency_customer_site',
                { p_agency_id: agencyHomepage.agencyId },
            )

            if (accessError || !canAccess) {
                const next = encodeURIComponent(returnPath)
                await redirectWithAgencyPreview(
                    `/login?error=customer_site_access_denied&next=${next}`,
                )
            }
        }
    }

    let tourOptions: Awaited<ReturnType<typeof fetchPublishedToursForBooking>> = []
    let lockedTour: Awaited<ReturnType<typeof fetchBookingTourBySlug>> = null

    try {
        if (packageKind && packageId?.trim()) {
            lockedTour = await fetchBookingPackageById(packageKind, packageId.trim())
        } else {
            ;[tourOptions, lockedTour] = await Promise.all([
                fetchPublishedToursForBooking(),
                tourSlug?.trim()
                    ? fetchBookingTourBySlug(tourSlug.trim(), slotId?.trim() || null)
                    : Promise.resolve(null),
            ])
        }
    } catch {
        // Avoid 500 when Supabase is unavailable; client shows empty plan list.
    }

    const emailBranding = resolveBookingEmailBrandingFromHomepage(agencyHomepage)

    return (
        <BookingPage
            tourOptions={tourOptions}
            lockedTour={lockedTour}
            initialSlotId={packageKind ? null : slotId?.trim() || null}
            isDemoMode={!isAgencySite}
            emailBranding={emailBranding}
            bookingReturnPath={returnPath}
        />
    )
}
