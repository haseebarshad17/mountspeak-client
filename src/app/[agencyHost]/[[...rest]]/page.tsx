import { notFound, redirect } from 'next/navigation'
import type { Metadata, Viewport } from 'next'

import AboutUsPage from '@/app/about-us/page'
import BookingPage from '@/app/booking/page'
import BookingsPage from '@/app/bookings/page'
import SavedToursRoutePage from '@/app/saved-tours/page'
import ContactUsPage from '@/app/contact-us/page'
import DashboardPage from '@/app/dashboard/page'
import DiscoverPage from '@/app/discover/page'
import FaqPage from '@/app/faq/page'
import HomePage from '@/app/page'
import LoginPage from '@/app/(auth)/login/page'
import SearchPage from '@/app/search/page'
import TermsPage from '@/app/terms/page'
import PrivacyPage from '@/app/privacy/page'
import TourDetailPage from '@/app/tours/[slug]/page'
import BlogDetailRoutePage from '@/app/blogs/[slug]/page'
import DetailsPage from '@/app/details/page'
import DashboardShell from '@/components/pages/dashboard/DashboardShell'
import { buildPlatformMetadata } from '@/assests/meta'
import { isAgencyHostPathSegment } from '@/lib/homepage/agency-preview'
import { getHomepageMetadata } from '@/lib/homepage/homepage-meta'
import { getRequestSiteUrl } from '@/lib/homepage/resolve-request-host'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'
import InternationalPackageDetailPage from '@/app/packages/international/[id]/page'
import UmrahPackageDetailPage from '@/app/packages/umrah/[id]/page'

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
        return buildPlatformMetadata(await getRequestSiteUrl())
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
    const resolvedSearchParams = await searchParams

    if (!isAgencyHostPathSegment(agencyHost)) {
        notFound()
    }

    const rest = params.rest ?? []
    const path = rest.join('/')

    const redirectAgencyAuthToLogin = () => {
        const next = resolvedSearchParams.next
        const query =
            typeof next === 'string' && next.startsWith('/')
                ? `?next=${encodeURIComponent(next)}`
                : ''
        redirect(`/${agencyHost}/login${query}`)
    }

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

    if (path === 'faq') {
        return <FaqPage />
    }

    if (path === 'contact-us') {
        return <ContactUsPage />
    }

    if (path === 'terms') {
        return <TermsPage />
    }

    if (path === 'privacy') {
        return <PrivacyPage />
    }

    if (path === 'dashboard') {
        return (
            <DashboardShell>
                <DashboardPage />
            </DashboardShell>
        )
    }

    if (path === 'bookings') {
        return (
            <DashboardShell>
                <BookingsPage />
            </DashboardShell>
        )
    }

    if (path === 'saved-tours') {
        return (
            <DashboardShell>
                <SavedToursRoutePage />
            </DashboardShell>
        )
    }

    if (path === 'booking') {
        return <BookingPage searchParams={searchParams} />
    }

    if (path === 'login') {
        return <LoginPage searchParams={searchParams} />
    }

    if (path === 'register') {
        redirectAgencyAuthToLogin()
    }

    if (path === 'forgot-password' || path === 'reset-password' || path === 'verify-email') {
        redirectAgencyAuthToLogin()
    }

    if (rest[0] === 'tours' && rest[1]) {
        return <TourDetailPage params={Promise.resolve({ slug: rest[1] })} />
    }

    // Agency site is served through this catch-all route (/[agencyHost]/[[...rest]]).
    // Ensure package detail pages are reachable here as well.
    if (rest[0] === 'packages' && rest[1] === 'umrah' && rest[2]) {
        return <UmrahPackageDetailPage params={Promise.resolve({ id: rest[2] })} />
    }

    if (rest[0] === 'packages' && rest[1] === 'international' && rest[2]) {
        return <InternationalPackageDetailPage params={Promise.resolve({ id: rest[2] })} />
    }

    if (path === 'details') {
        return <DetailsPage />
    }

    if (rest[0] === 'blogs' && rest[1]) {
        return <BlogDetailRoutePage params={Promise.resolve({ slug: rest[1] })} />
    }

    notFound()
}
