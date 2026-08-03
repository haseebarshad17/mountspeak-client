import { notFound } from 'next/navigation'
import { BookingRequestPageContent } from '@/components/booking/BookingRequestPageContent'
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
        <BookingRequestPageContent
            page={homepage.page}
            capabilities={capabilities}
            agencyId={homepage.agencyId}
            kind={kind}
            id={id}
            title={title}
        />
    )
}
