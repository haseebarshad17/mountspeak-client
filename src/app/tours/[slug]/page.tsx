import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import TourPageContent from '@/components/pages/tour/TourPageContent'
import { DEMO_TOUR_DETAIL_PATH } from '@/lib/tours/default-tour-page'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'
import { fetchPublishedTourBySlug, fetchTourPageBySlug } from '@/services/tours/tours.server'

type TourDetailPageProps = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: TourDetailPageProps): Promise<Metadata> {
    const { slug } = await params
    const page = await fetchTourPageBySlug(slug)

    if (!page?.seo) {
        return {
            title: 'Tour Detail | Pakistan Travel',
        }
    }

    return {
        title: page.seo.metaTitle,
        description: page.seo.metaDescription,
        keywords: page.seo.keywords,
        openGraph: page.seo.ogImage
            ? {
                  images: [{ url: page.seo.ogImage }],
              }
            : undefined,
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
        notFound()
    }

    const page = await fetchTourPageBySlug(slug)

    if (!page) {
        notFound()
    }

    return <TourPageContent page={page} />
}
