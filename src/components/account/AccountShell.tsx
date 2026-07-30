'use client'

import { useEffect, type ReactNode } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { AccountSidebar } from '@/components/account/AccountSidebar'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { useOptionalUser } from '@/services/auth/auth.query'
import type { HomepagePage } from '@/services/agency/agency.types'
import type { AgencySpecializationCapabilities } from '@/services/specialization/specialization.types'

export function AccountShell({
    page,
    capabilities,
    agencyId,
    title,
    subtitle,
    children,
}: {
    page: HomepagePage
    capabilities: AgencySpecializationCapabilities
    agencyId: string
    title: string
    subtitle: string
    children: ReactNode
}) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { data: user, isLoading } = useOptionalUser()

    useEffect(() => {
        if (isLoading) return
        if (user) return
        const host = searchParams.get('host')
        const params = new URLSearchParams()
        params.set('next', pathname)
        if (host) params.set('host', host)
        router.replace(`/login?${params.toString()}`)
    }, [isLoading, user, router, pathname, searchParams])

    if (isLoading || !user) {
        return (
            <>
                <SiteHeader page={page} capabilities={capabilities} />
                <main className="flex min-h-[60vh] items-center justify-center bg-[#FCF8F3]">
                    <div className="h-9 w-9 animate-pulse rounded-full bg-[#06403D]/20" />
                </main>
                <SiteFooter page={page} agencyId={agencyId} />
            </>
        )
    }

    return (
        <>
            <SiteHeader page={page} capabilities={capabilities} />
            <main className="min-h-screen bg-[#FCF8F3] py-10 md:py-14">
                <div className="site-container flex flex-col gap-8 md:flex-row md:gap-10">
                    <AccountSidebar />
                    <div className="min-w-0 flex-1">
                        <h1 className="text-3xl font-bold tracking-tight text-[#111]">
                            {title}
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-[#666]">{subtitle}</p>
                        <div className="mt-8" data-agency-id={agencyId}>
                            {children}
                        </div>
                    </div>
                </div>
            </main>
            <SiteFooter page={page} agencyId={agencyId} />
        </>
    )
}
