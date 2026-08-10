'use client'

import { useEffect, type ReactNode } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { AccountSidebar } from '@/components/account/AccountSidebar'
import { ClassicPageHero } from '@/components/pages/ClassicPageHero'
import { Temp3PageHero } from '@/components/pages/Temp3PageHero'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import { resolveThemeAssetUrl } from '@/lib/media/resolve-theme-asset'
import { copyAgencyPreviewParams } from '@/lib/templates/preview-template'
import { useOptionalUser } from '@/services/auth/auth.query'
import type { HomepagePage } from '@/services/agency/agency.types'
import type { AgencySpecializationCapabilities } from '@/services/specialization/specialization.types'

function resolveAccountHeroImage(page: HomepagePage) {
    return (
        resolveThemeAssetUrl(page.sections?.hero?.backgroundImages?.[0]) ||
        resolveThemeAssetUrl(page.sections?.hero?.backgroundImage) ||
        resolveThemeAssetUrl(page.sections?.planPerfectTrip?.image?.src) ||
        ''
    )
}

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
    const variant = useTemplateVariant()
    const { data: user, isLoading } = useOptionalUser()
    const imageSrc = resolveAccountHeroImage(page)

    useEffect(() => {
        if (isLoading) return
        if (user) return
        const params = new URLSearchParams()
        params.set('next', pathname)
        copyAgencyPreviewParams(params, searchParams)
        router.replace(`/login?${params.toString()}`)
    }, [isLoading, user, router, pathname, searchParams])

    if (isLoading || !user) {
        return (
            <>
                <SiteHeader
                    page={page}
                    capabilities={capabilities}
                    overlay={variant === 'temp1'}
                />
                <main className="site-bg flex min-h-[60vh] items-center justify-center">
                    <div className="h-9 w-9 animate-pulse rounded-full bg-[color-mix(in_srgb,var(--color-brand)_20%,transparent)]" />
                </main>
                <SiteFooter page={page} agencyId={agencyId} capabilities={capabilities} />
            </>
        )
    }

    if (variant === 'temp3') {
        return (
            <>
                <SiteHeader page={page} capabilities={capabilities} />
                <main className="site-bg">
                    <Temp3PageHero
                        eyebrow="Account"
                        title={title}
                        subtitle={subtitle}
                        imageSrc={imageSrc}
                        size="compact"
                    />
                    <section className="t3-section t3-section-cream">
                        <div className="t3-wrap flex flex-col gap-8 md:flex-row md:gap-10">
                            <AccountSidebar />
                            <div className="min-w-0 flex-1" data-agency-id={agencyId}>
                                {children}
                            </div>
                        </div>
                    </section>
                </main>
                <SiteFooter page={page} agencyId={agencyId} capabilities={capabilities} />
            </>
        )
    }

    if (variant === 'temp1') {
        return (
            <>
                <SiteHeader page={page} capabilities={capabilities} overlay />
                <main className="site-bg">
                    <ClassicPageHero
                        eyebrow="Account"
                        title={title}
                        subtitle={subtitle}
                        align="left"
                        size="default"
                        imageSrc={imageSrc}
                    />
                    <section className="section-spacing section-spacing-top bg-white">
                        <div className="site-container flex flex-col gap-8 md:flex-row md:gap-10">
                            <AccountSidebar />
                            <div
                                className="min-w-0 flex-1 rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6"
                                data-agency-id={agencyId}
                            >
                                {children}
                            </div>
                        </div>
                    </section>
                </main>
                <SiteFooter page={page} agencyId={agencyId} capabilities={capabilities} />
            </>
        )
    }

    return (
        <>
            <SiteHeader page={page} capabilities={capabilities} />
            <main className="site-bg min-h-screen py-10 md:py-14">
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
            <SiteFooter page={page} agencyId={agencyId} capabilities={capabilities} />
        </>
    )
}
