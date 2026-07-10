import { notFound } from 'next/navigation'
import type { Metadata, Viewport } from 'next'

import AboutUsPage from '@/app/about-us/page'
import BookingPage from '@/app/booking/page'
import BookingsPage from '@/app/bookings/page'
import ContactUsPage from '@/app/contact-us/page'
import DashboardPage from '@/app/dashboard/page'
import DiscoverPage from '@/app/discover/page'
import FaqPage from '@/app/faq/page'
import ForgotPasswordPage from '@/app/(auth)/forgot-password/page'
import HomePage from '@/app/page'
import LoginPage from '@/app/(auth)/login/page'
import RegisterPage from '@/app/(auth)/register/page'
import ResetPasswordPage from '@/app/(auth)/reset-password/page'
import SearchPage from '@/app/search/page'
import TermsPage from '@/app/terms/page'
import PrivacyPage from '@/app/privacy/page'
import TourDetailPage from '@/app/tours/[slug]/page'
import BlogDetailRoutePage from '@/app/blogs/[slug]/page'
import DetailsPage from '@/app/details/page'
import VerifyEmailPage from '@/app/(auth)/verify-email/page'
import DashboardShell from '@/components/pages/dashboard/DashboardShell'
import { buildPlatformMetadata } from '@/assests/meta'
import { isAgencyHostPathSegment } from '@/lib/homepage/agency-preview'
import { getHomepageMetadata } from '@/lib/homepage/homepage-meta'
import { getRequestSiteUrl } from '@/lib/homepage/resolve-request-host'
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

    if (path === 'booking') {
        return <BookingPage searchParams={searchParams} />
    }

    if (path === 'login') {
        return <LoginPage />
    }

    if (path === 'register') {
        return <RegisterPage />
    }

    if (path === 'forgot-password') {
        return <ForgotPasswordPage />
    }

    if (path === 'reset-password') {
        return <ResetPasswordPage />
    }

    if (path === 'verify-email') {
        return <VerifyEmailPage />
    }

    if (rest[0] === 'tours' && rest[1]) {
        return <TourDetailPage params={Promise.resolve({ slug: rest[1] })} />
    }

    if (path === 'details') {
        return <DetailsPage />
    }

    if (rest[0] === 'blogs' && rest[1]) {
        return <BlogDetailRoutePage params={Promise.resolve({ slug: rest[1] })} />
    }

    notFound()
}
