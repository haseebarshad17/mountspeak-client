import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import AuthSplitPage from '@/components/pages/auth/AuthSplitPage'
import { buildPageMetadata } from '@/lib/homepage/build-page-metadata'
import { redirectIfAuthenticated } from '@/lib/auth/redirect-if-authenticated'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

type RegisterPageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata(): Promise<Metadata> {
    const homepage = await fetchAgencyHomepage()

    return await buildPageMetadata({
        pageTitle: 'Register',
        homepage,
    })
}

function buildLoginRedirectPath(
    searchParams: Record<string, string | string[] | undefined>,
): string {
    const next = searchParams.next
    if (typeof next === 'string' && next.startsWith('/')) {
        return `/login?next=${encodeURIComponent(next)}`
    }

    return '/login'
}

export default async function Page({ searchParams }: RegisterPageProps) {
    const homepage = await fetchAgencyHomepage()
    const resolvedSearchParams = await searchParams

    if (homepage.isAgencySite) {
        redirect(buildLoginRedirectPath(resolvedSearchParams))
    }

    await redirectIfAuthenticated()

    return (
        <Suspense fallback={<div className='min-h-dvh bg-white' aria-hidden />}>
            <AuthSplitPage mode='register' />
        </Suspense>
    )
}
