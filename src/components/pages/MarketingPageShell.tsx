'use client'

import type { ReactNode } from 'react'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import type { HomepagePage } from '@/services/agency/agency.types'
import type { AgencySpecializationCapabilities } from '@/services/specialization/specialization.types'

export function MarketingPageShell({
    page,
    title,
    subtitle,
    children,
    capabilities,
    agencyId,
}: {
    page: HomepagePage
    title: string
    subtitle: string
    children: ReactNode
    capabilities?: AgencySpecializationCapabilities
    agencyId?: string
}) {
    return (
        <>
            <SiteHeader page={page} capabilities={capabilities} />
            <main className="site-bg">
                <section className="pb-12 pt-14 md:pb-16 md:pt-20">
                    <div className="site-container">
                        <p className="text-sm uppercase text-[#777]">
                            {page.branding.name}
                        </p>
                        <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#111] md:text-5xl">
                            {title}
                        </h1>
                        <p className="mt-3 max-w-2xl text-[#333]/70">{subtitle}</p>
                    </div>
                </section>
                {children}
            </main>
            <SiteFooter page={page} agencyId={agencyId} />
        </>
    )
}
