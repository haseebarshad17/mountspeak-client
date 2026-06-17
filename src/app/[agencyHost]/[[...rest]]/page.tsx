import { notFound } from 'next/navigation'
import type { Metadata, Viewport } from 'next'

import AboutUsPage from '@/app/about-us/page'
import BookingPage from '@/app/booking/page'
import BookingsPage from '@/app/bookings/page'
import ContactUsPage from '@/app/contact-us/page'
import DashboardPage from '@/app/dashboard/page'
import DiscoverPage from '@/app/discover/page'
import HomePage from '@/app/page'
import SearchPage from '@/app/search/page'
import TermsPage from '@/app/terms/page'
import TourDetailPage from '@/app/tours/[slug]/page'
import { defaultMeta } from '@/assests/meta'
import { isAgencyHostPathSegment } from '@/lib/homepage/agency-preview'
import { getHomepageMetadata } from '@/lib/homepage/homepage-meta'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'

type AgencyPreviewPageProps = {
    params: {
        agencyHost: string
        rest?: string[]
    }
    searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata(): Promise<Metadata> {
    const agencyHomepage = await fetchAgencyHomepage()

    try {
        return getHomepageMetadata(agencyHomepage)
    } catch {
        return defaultMeta
    }
}

export async function generateViewport(): Promise<Viewport> {
    const agencyHomepage = await fetchAgencyHomepage()

    return {
        themeColor: agencyHomepage.page.seo.themeColor,
    }
}

export default async function AgencyPreviewPage({ params, searchParams }: AgencyPreviewPageProps) {
    const agencyHost = params.agencyHost.toLowerCase()

    if (!isAgencyHostPathSegment(agencyHost)) {
        notFound()
    }

    const rest = params.rest ?? []
    const path = rest.join('/')

    if (rest.length === 0) {
        return <HomePage />
    }

    if (path === 'search') {
        return <SearchPage searchParams={searchParams} />
    }

    if (path === 'discover') {
        return <DiscoverPage />
    }

    if (path === 'about-us') {
        return <AboutUsPage />
    }

    if (path === 'contact-us') {
        return <ContactUsPage />
    }

    if (path === 'terms') {
        return <TermsPage />
    }

    if (path === 'dashboard') {
        return <DashboardPage />
    }

    if (path === 'bookings') {
        return <BookingsPage />
    }

    if (path === 'booking') {
        return <BookingPage searchParams={searchParams} />
    }

    if (rest[0] === 'tours' && rest[1]) {
        return <TourDetailPage params={Promise.resolve({ slug: rest[1] })} />
    }

    notFound()
}
