import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { BookingRequestForm } from '@/components/booking/BookingRequestForm'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { AgencyLink } from '@/components/links/AgencyLink'
import { loadAgencyContext } from '@/lib/site/load-agency-context'
import { createServerSupabase } from '@/lib/supabase/supabase.server'
import { getPackageListingTitle } from '@/services/listings/listings.service'
import { isValidAgencyId } from '@/services/specialization/specialization.service'

type PageProps = {
    searchParams: Promise<{
        kind?: string
        id?: string
        title?: string
    }>
}

export default async function BookingRequestPage({ searchParams }: PageProps) {
    const params = await searchParams
    const kindRaw = params.kind?.trim()
    const kind =
        kindRaw === 'umrah' || kindRaw === 'packages'
            ? 'umrah'
            : kindRaw === 'international'
              ? 'international'
              : null
    const id = params.id?.trim()
    if (!kind || !id) notFound()

    const { homepage, capabilities } = await loadAgencyContext()
    if (!isValidAgencyId(homepage.agencyId)) notFound()

    const title = await getPackageListingTitle({
        supabase: createServerSupabase(),
        agencyId: homepage.agencyId,
        kind,
        id,
        fallback: params.title,
    })

    return (
        <>
            <SiteHeader page={homepage.page} capabilities={capabilities} />
            <main className="min-h-screen bg-[#FCF8F3] px-4 py-10 md:px-6 md:py-14">
                <div className="mx-auto max-w-3xl">
                    <AgencyLink
                        href={kind === 'umrah' ? '/packages' : '/tours'}
                        className="text-sm text-[#666] transition hover:text-[#111]"
                    >
                        ← Back to listings
                    </AgencyLink>
                    <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#111]">
                        Request booking
                    </h1>
                    <p className="mt-2 text-sm text-[#666]">
                        Send an inquiry for this{' '}
                        {kind === 'umrah' ? 'Hajj / Umrah package' : 'international tour'}.
                        The agency will confirm availability and next steps.
                    </p>

                    <div className="mt-8">
                        <Suspense
                            fallback={
                                <div className="h-40 animate-pulse rounded-2xl bg-white" />
                            }
                        >
                            <BookingRequestForm
                                agencyId={homepage.agencyId}
                                capabilities={capabilities}
                                lockedDestination={title}
                                listingKind={kind}
                                umrahPlanId={kind === 'umrah' ? id : null}
                                internationalTourId={
                                    kind === 'international' ? id : null
                                }
                                title={title}
                                subtitle="Your request is linked to this package and reviewed by the agency team."
                                submitLabel="Send booking request"
                            />
                        </Suspense>
                    </div>
                </div>
            </main>
            <SiteFooter page={homepage.page} agencyId={homepage.agencyId} />
        </>
    )
}
