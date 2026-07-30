'use client'

import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { AgencyLink } from '@/components/links/AgencyLink'
import { resolveThemeAssetUrl } from '@/lib/media/resolve-theme-asset'
import type { HomepagePage } from '@/services/agency/agency.types'
import { BrandMark } from '../layout/SiteHeader'

const FALLBACK_AUTH_IMAGE =
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80'

export function AuthSplitShell({
    page,
    title = 'Welcome back',
    subtitle = 'Sign in with a magic link sent to your email — no password needed.',
    children,
}: {
    page: HomepagePage
    title?: string
    subtitle?: string
    children: ReactNode
}) {
    const brand = page.branding.name
    const logoSrc =
        resolveThemeAssetUrl(page.branding.logo?.onDark?.src) ||
        resolveThemeAssetUrl(page.branding.logo?.default?.src)
    const panelImage =
        resolveThemeAssetUrl(page.sections?.hero?.backgroundImage) ||
        resolveThemeAssetUrl(page.sections?.hero?.backgroundImages?.[0]) ||
        FALLBACK_AUTH_IMAGE

    return (
        <div className="flex min-h-screen bg-[#FCF8F3]">
            {/* Left panel */}
            <aside className="relative hidden w-1/2 overflow-hidden lg:block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={panelImage}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/25" />
                <div className="relative z-10 flex h-full flex-col px-10 py-10 xl:px-14">
                    <AgencyLink
                        href="/"
                        aria-label="Back to homepage"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </AgencyLink>

                    <AgencyLink
                        href="/"
                        aria-label={brand}
                        className="inline-flex max-w-[160px] items-center shrink-0 sm:max-w-[200px] mt-4"
                    >
                        <BrandMark brand={brand} logoSrc={logoSrc} />
                    </AgencyLink>

                    <div className="mt-auto max-w-md pb-6 text-white">
                        <h1 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
                            Discover the rugged beauty.
                        </h1>
                        <p className="mt-4 text-base leading-relaxed text-white/80">
                            {page.branding.tagline ||
                                `Travel with ${brand} — curated tours, packages, and journeys designed around how you explore.`}
                        </p>
                    </div>
                </div>
            </aside>

            {/* Right form panel */}
            <section className="flex w-full flex-col lg:w-1/2">
                <div className="flex items-center justify-between px-5 py-5 lg:hidden">
                    <AgencyLink
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#111]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </AgencyLink>

                    <AgencyLink
                        href="/"
                        aria-label={brand}
                        className="inline-flex max-w-[160px] items-center shrink-0 sm:max-w-[200px] mt-4"
                    >
                        <BrandMark brand={brand} logoSrc={logoSrc} />
                    </AgencyLink>
                </div>

                <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-10">
                    <div className="w-full max-w-[420px]">
                        <p className="text-sm uppercase tracking-[0.16em] text-[#888]">
                            Account
                        </p>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111]">
                            {title}
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-[#666]">
                            {subtitle}
                        </p>
                        <div className="mt-8">{children}</div>
                    </div>
                </div>
            </section>
        </div>
    )
}
