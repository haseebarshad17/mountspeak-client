import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import TourPageContent from '@/components/pages/tour/TourPageContent'
import { buildPageMetadata } from '@/lib/homepage/build-page-metadata'
import { DEMO_TOUR_PAGE } from '@/lib/tours/default-tour-page'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'

export async function generateMetadata(): Promise<Metadata> {
    const homepage = await fetchAgencyHomepage()

    if (homepage.isAgencySite) {
        return buildPageMetadata({
            pageTitle: 'Tour Detail',
            homepage,
        })
    }

    return {
        title: DEMO_TOUR_PAGE.seo.metaTitle,
        description: DEMO_TOUR_PAGE.seo.metaDescription,
        keywords: DEMO_TOUR_PAGE.seo.keywords,
        openGraph: DEMO_TOUR_PAGE.seo.ogImage
            ? {
                  images: [{ url: DEMO_TOUR_PAGE.seo.ogImage }],
              }
            : undefined,
    }
}

export default async function DetailsPage() {
    const homepage = await fetchAgencyHomepage()

    if (homepage.isAgencySite) {
        notFound()
    }

    return <TourPageContent page={DEMO_TOUR_PAGE} />
}
