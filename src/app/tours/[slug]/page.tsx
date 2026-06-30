import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import TourPageContent from '@/components/pages/tour/TourPageContent'
import { buildPageMetadata } from '@/lib/homepage/build-page-metadata'
import {
    getHostnameFromHostHeader,
    isAgencyPreviewPlatformHost,
} from '@/lib/homepage/agency-preview'
import { getRequestSiteHost } from '@/lib/homepage/resolve-request-host'
import { DEMO_TOUR_DETAIL_PATH } from '@/lib/tours/default-tour-page'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'
import { fetchPublishedTourBySlug, fetchTourPageBySlug } from '@/services/tours/tours.server'

type TourDetailPageProps = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: TourDetailPageProps): Promise<Metadata> {
    const { slug } = await params
    const homepage = await fetchAgencyHomepage()
    const page = await fetchTourPageBySlug(slug)

    const pageTitle = page?.seo?.metaTitle ?? 'Tour Detail'
    const description = page?.seo?.metaDescription

    const base = await buildPageMetadata({
        pageTitle,
        description,
        homepage,
    })

    if (!page?.seo) {
        return base
    }

    return {
        ...base,
        keywords: page.seo.keywords,
        openGraph: page.seo.ogImage
            ? {
                  ...base.openGraph,
                  images: [{ url: page.seo.ogImage }],
              }
            : base.openGraph,
    }
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
    const homepage = await fetchAgencyHomepage()

    if (!homepage.isAgencySite) {
        redirect(DEMO_TOUR_DETAIL_PATH)
    }

    const { slug } = await params
    const row = await fetchPublishedTourBySlug(slug)

    if (!row) {
        const requestHost = await getRequestSiteHost()
        const hostname = getHostnameFromHostHeader(requestHost)

        if (isAgencyPreviewPlatformHost(hostname)) {
            redirect(DEMO_TOUR_DETAIL_PATH)
        }

        notFound()
    }

    const page = await fetchTourPageBySlug(slug)

    if (!page) {
        const requestHost = await getRequestSiteHost()
        const hostname = getHostnameFromHostHeader(requestHost)

        if (isAgencyPreviewPlatformHost(hostname)) {
            redirect(DEMO_TOUR_DETAIL_PATH)
        }

        notFound()
    }

    return <TourPageContent page={page} />
}
