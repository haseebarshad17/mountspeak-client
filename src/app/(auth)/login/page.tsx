import { Suspense } from 'react'

import AuthSplitPage from '@/components/pages/auth/AuthSplitPage'
import { buildPageMetadata } from '@/lib/homepage/build-page-metadata'
import { redirectIfAuthenticated } from '@/lib/auth/redirect-if-authenticated'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
    const homepage = await fetchAgencyHomepage()

    return buildPageMetadata({
        pageTitle: 'Login',
        homepage,
    })
}

export default async function Page() {
    await redirectIfAuthenticated()

    return (
        <Suspense fallback={<div className='min-h-dvh bg-white' aria-hidden />}>
            <AuthSplitPage mode='login' />
        </Suspense>
    )
}
