import { redirect } from 'next/navigation'

import { buildPageMetadata } from '@/lib/homepage/build-page-metadata'
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
    const resolvedSearchParams = await searchParams

    redirect(buildLoginRedirectPath(resolvedSearchParams))
}
