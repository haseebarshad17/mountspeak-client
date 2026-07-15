import { Suspense } from 'react'

import AgencyMagicLinkPage from '@/components/pages/auth/AgencyMagicLinkPage'
import { buildPageMetadata } from '@/lib/homepage/build-page-metadata'
import { redirectIfAuthenticated } from '@/lib/auth/redirect-if-authenticated'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
    const homepage = await fetchAgencyHomepage()

    return await buildPageMetadata({
        pageTitle: 'Login',
        homepage,
    })
}

type LoginPageProps = {
    searchParams?: Promise<{ error?: string }>
}

export default async function Page({ searchParams }: LoginPageProps) {
    const resolvedSearchParams = searchParams ? await searchParams : {}
    const showStaffBookingBlock = resolvedSearchParams.error === 'customer_site_access_denied'

    if (!showStaffBookingBlock) {
        await redirectIfAuthenticated()
    }

    return (
        <Suspense fallback={<div className='min-h-dvh bg-white' aria-hidden />}>
            <AgencyMagicLinkPage staffBookingBlocked={showStaffBookingBlock} />
        </Suspense>
    )
}
