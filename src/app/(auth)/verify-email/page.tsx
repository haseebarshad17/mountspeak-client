import { Suspense } from 'react'

import VerifyEmailPage from '@/components/pages/auth/VerifyEmailPage'
import { buildPageMetadata } from '@/lib/homepage/build-page-metadata'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
    const homepage = await fetchAgencyHomepage()

    return await buildPageMetadata({
        pageTitle: 'Verify Email',
        homepage,
    })
}

export default function Page() {
    return (
        <Suspense fallback={<div className='min-h-dvh bg-white' aria-hidden />}>
            <VerifyEmailPage />
        </Suspense>
    )
}
