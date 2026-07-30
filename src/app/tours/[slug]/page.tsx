import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { TourDetailContent } from '@/components/tours/TourDetailContent'
import { loadAgencyContext } from '@/lib/site/load-agency-context'
import { createServerSupabase } from '@/lib/supabase/supabase.server'
import { getTourBySlugOrId } from '@/services/listings/listings.service'
import { isValidAgencyId } from '@/services/specialization/specialization.service'

type PageProps = {
    params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { homepage } = await loadAgencyContext()
    if (!isValidAgencyId(homepage.agencyId)) {
        return { title: 'Tour' }
    }

    const tour = await getTourBySlugOrId({
        supabase: createServerSupabase(),
        agencyId: homepage.agencyId,
        slugOrId: params.slug,
    })

    if (!tour) return { title: 'Tour not found' }

    return {
        title: tour.title,
        description: tour.overviewBody || tour.subtitle || tour.title,
        openGraph: tour.heroImageUrl
            ? {
                  title: tour.title,
                  description: tour.overviewBody || tour.subtitle || undefined,
                  images: [{ url: tour.heroImageUrl, alt: tour.title }],
              }
            : undefined,
    }
}

export default async function TourDetailPage({ params }: PageProps) {
    const { homepage, capabilities } = await loadAgencyContext()

    if (!isValidAgencyId(homepage.agencyId)) notFound()

    const tour = await getTourBySlugOrId({
        supabase: createServerSupabase(),
        agencyId: homepage.agencyId,
        slugOrId: params.slug,
    })

    if (!tour) notFound()

    return (
        <TourDetailContent
            page={homepage.page}
            capabilities={capabilities}
            tour={tour}
            agencyId={homepage.agencyId}
        />
    )
}
