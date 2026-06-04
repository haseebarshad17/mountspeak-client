import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import TourPageContent from '@/components/pages/tour/TourPageContent'
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
