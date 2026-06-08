import { redirect } from 'next/navigation'

import BookingPage from '@/components/pages/booking/BookingPage'
import { buildBookingReturnPath, buildLoginUrlForBooking } from '@/lib/auth/booking-auth'
import { createServerSupabase } from '@/lib/supabase/supabase.server'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'
import {
    fetchBookingTourBySlug,
    fetchPublishedToursForBooking,
} from '@/services/tours/tours.server'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Booking | Pakistan Travel',
    description: 'Begin your journey with us — partner booking and registration.',
}

type BookingRoutePageProps = {
    searchParams: Promise<{ tour?: string }>
}

export default async function Page({ searchParams }: BookingRoutePageProps) {
    const { tour: tourSlug } = await searchParams
    const returnPath = buildBookingReturnPath(tourSlug)
    const agencyHomepage = await fetchAgencyHomepage()
    const isAgencySite = agencyHomepage.isAgencySite

    if (isAgencySite) {
        const supabase = await createServerSupabase()
        const { data: authData } = await supabase.auth.getUser()

        if (!authData.user) {
            redirect(buildLoginUrlForBooking(returnPath))
        }

        const { data: profile } = await supabase
            .from('users')
            .select('role')
            .eq('id', authData.user.id)
            .single()

        if (profile?.role !== 'CLIENT') {
            redirect('/login?error=role_not_allowed')
        }
    }

    let tourOptions: Awaited<ReturnType<typeof fetchPublishedToursForBooking>> = []
    let lockedTour: Awaited<ReturnType<typeof fetchBookingTourBySlug>> = null

    try {
        ;[tourOptions, lockedTour] = await Promise.all([
            fetchPublishedToursForBooking(),
            tourSlug?.trim()
                ? fetchBookingTourBySlug(tourSlug.trim())
                : Promise.resolve(null),
        ])
    } catch {
        // Avoid 500 when Supabase is unavailable; client shows empty plan list.
    }

    return (
        <BookingPage
            tourOptions={tourOptions}
            lockedTour={lockedTour}
            isDemoMode={!isAgencySite}
        />
    )
}
