import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { TourBookingWizard } from '@/components/booking/TourBookingWizard'
import type { BookingTourOption } from '@/components/booking/booking-tour.types'
import { loadAgencyContext } from '@/lib/site/load-agency-context'
import { createServerSupabase } from '@/lib/supabase/supabase.server'
import { getTourBySlugOrId } from '@/services/listings/listings.service'
import { isValidAgencyId } from '@/services/specialization/specialization.service'

type PageProps = {
    searchParams: Promise<{
        tour?: string
        adults?: string
        children?: string
        kind?: string
        id?: string
        slot?: string
    }>
}

export default async function BookingPage({ searchParams }: PageProps) {
    const params = await searchParams

    // Packages / international use booking requests — never domestic checkout.
    if (
        (params.kind === 'umrah' ||
            params.kind === 'international' ||
            params.kind === 'packages') &&
        params.id
    ) {
        const { redirect } = await import('next/navigation')
        const kind = params.kind === 'packages' ? 'umrah' : params.kind
        redirect(`/booking/request?kind=${kind}&id=${encodeURIComponent(params.id)}`)
    }

    const { homepage, capabilities } = await loadAgencyContext()
    if (!isValidAgencyId(homepage.agencyId)) notFound()

    const slug = params.tour?.trim()
    if (!slug) notFound()

    const tour = await getTourBySlugOrId({
        supabase: createServerSupabase(),
        agencyId: homepage.agencyId,
        slugOrId: slug,
    })
    if (!tour || tour.pricePerSeat <= 0) notFound()

    const option: BookingTourOption = {
        id: tour.id,
        slug: tour.slug,
        title: tour.title,
        agencyId: tour.agencyId,
        pricePerSeat: tour.pricePerSeat,
        advanceAmountPerSeat: tour.advanceAmountPerSeat,
        discountPercent: tour.discountPercent,
        kidsDiscountPercent: tour.kidsDiscountPercent,
        currency: tour.currency || 'PKR',
        startDate: tour.startDate,
        capacityTotal: tour.capacityTotal,
        confirmedSeats: tour.confirmedSeats ?? 0,
        heroImageUrl: tour.heroImageUrl,
        slots: tour.slots,
    }

    const adults = Number(params.adults)
    const children = Number(params.children)
    const initialSlotId = params.slot?.trim() || null

    return (
        <Suspense fallback={<div className="site-bg min-h-screen" />}>
            <TourBookingWizard
                page={homepage.page}
                capabilities={capabilities}
                tour={option}
                initialAdults={Number.isFinite(adults) && adults > 0 ? adults : 2}
                initialChildren={
                    Number.isFinite(children) && children >= 0 ? children : 0
                }
                initialSlotId={initialSlotId}
            />
        </Suspense>
    )
}
