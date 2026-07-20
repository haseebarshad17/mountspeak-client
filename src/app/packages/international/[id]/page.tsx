import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import TourPageContent from '@/components/pages/tour/TourPageContent'
import { buildPageMetadata } from '@/lib/homepage/build-page-metadata'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'
import { fetchInternationalPackagePageById } from '@/services/tours/tours.server'

type PackageDetailPageProps = {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PackageDetailPageProps): Promise<Metadata> {
    const { id } = await params
    const homepage = await fetchAgencyHomepage()
    const page = await fetchInternationalPackagePageById(id)

    return buildPageMetadata({
        pageTitle: page?.seo?.metaTitle ?? 'International Tour',
        description: page?.seo?.metaDescription,
        homepage,
    })
}

export default async function InternationalPackageDetailPage({ params }: PackageDetailPageProps) {
    const homepage = await fetchAgencyHomepage()

    if (!homepage.isAgencySite) {
        notFound()
    }

    const { id } = await params
    const page = await fetchInternationalPackagePageById(id)

    if (!page) {
        notFound()
    }

    return <TourPageContent page={page} />
}
