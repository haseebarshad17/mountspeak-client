'use client'

import type { ReactNode } from 'react'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import {
    ClassicPageHero,
    type ClassicPageHeroAction,
} from '@/components/pages/ClassicPageHero'
import { Temp3PageHero } from '@/components/pages/Temp3PageHero'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import { resolveThemeAssetUrl } from '@/lib/media/resolve-theme-asset'
import type { HomepagePage } from '@/services/agency/agency.types'
import type { AgencySpecializationCapabilities } from '@/services/specialization/specialization.types'

function resolvePageHeroImage(page: HomepagePage) {
    return (
        resolveThemeAssetUrl(page.sections?.hero?.backgroundImages?.[0]) ||
        resolveThemeAssetUrl(page.sections?.hero?.backgroundImage) ||
        resolveThemeAssetUrl(page.sections?.planPerfectTrip?.image?.src) ||
        resolveThemeAssetUrl(page.sections?.bookATour?.backgroundImage) ||
        ''
    )
}

export function MarketingPageShell({
    page,
    title,
    subtitle,
    children,
    capabilities,
    agencyId,
    heroActions,
    heroSize = 'default',
}: {
    page: HomepagePage
    title: string
    subtitle: string
    children: ReactNode
    capabilities?: AgencySpecializationCapabilities
    agencyId?: string
    heroActions?: ClassicPageHeroAction[]
    heroSize?: 'default' | 'tall' | 'compact'
}) {
    const variant = useTemplateVariant()
    const imageSrc = resolvePageHeroImage(page)

    if (variant === 'temp3') {
        return (
            <>
                <SiteHeader page={page} capabilities={capabilities} />
                <main className="site-bg">
                    <Temp3PageHero
                        eyebrow={page.branding.name}
                        title={title}
                        subtitle={subtitle}
                        imageSrc={imageSrc}
                        actions={heroActions}
                        size={heroSize}
                    />
                    {children}
                </main>
                <SiteFooter page={page} agencyId={agencyId} />
            </>
        )
    }

    if (variant === 'temp1') {
        return (
            <>
                <SiteHeader page={page} capabilities={capabilities} overlay />
                <main className="site-bg">
                    <ClassicPageHero
                        eyebrow={page.branding.name}
                        title={title}
                        subtitle={subtitle}
                        imageSrc={imageSrc}
                        actions={heroActions}
                        size={heroSize}
                    />
                    {children}
                </main>
                <SiteFooter page={page} agencyId={agencyId} />
            </>
        )
    }

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
