'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { AgencyLink } from '@/components/links/AgencyLink'
import { ProfileMenu } from '@/components/account/ProfileMenu'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import { resolveThemeAssetUrl } from '@/lib/media/resolve-theme-asset'
import { useOptionalUser } from '@/services/auth/auth.query'
import type { HomepagePage } from '@/services/agency/agency.types'
import type { AgencySpecializationCapabilities } from '@/services/specialization/specialization.types'
import { cn } from '@/lib/utils/cn'
import TwoLineMenu from '@/assets/svg/menu/TwoLineMenu'

const NAV = [
    { label: 'Home', href: '/' },
    { label: 'Packages', href: '/packages' },
    { label: 'Tours', href: '/tours' },
    { label: 'Services', href: '/services' },
    { label: 'About Us', href: '/about-us' },
    { label: 'Contact', href: '/contact-us' },
]

function bookNowHref(capabilities?: AgencySpecializationCapabilities) {
    if (!capabilities) return '/tours'
    if (capabilities.hasTours) return '/tours'
    if (capabilities.hasPackages) return '/packages'
    if (capabilities.hasInternational) return '/tours'
    return '/search'
}

export function BrandMark({
    brand,
    logoSrc,
    className,
}: {
    brand: string
    logoSrc: string
    className?: string
}) {
    if (logoSrc) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={logoSrc}
                alt={brand}
                className={cn('h-9 w-auto max-w-full object-contain', className)}
            />
        )
    }

    return (
        <span
            className={cn(
                'text-[1.15rem] font-bold tracking-tight text-[#111]',
                className
            )}
        >
            {brand.toLowerCase().includes('company') ? 'postcard.ai' : brand}
        </span>
    )
}

export function SiteHeader({
    page,
    capabilities,
    overlay = false,
}: {
    page: HomepagePage
    capabilities?: AgencySpecializationCapabilities
    /** When true (homepage hero), modern header sits transparent over the hero. */
    overlay?: boolean
}) {
    const variant = useTemplateVariant()
    const brand = page.branding.name
    const ctaHref = bookNowHref(capabilities)
    const { data: user } = useOptionalUser()
    const [menuOpen, setMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        if (!menuOpen) return
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setMenuOpen(false)
        }
        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', onKeyDown)
        return () => {
            document.body.style.overflow = ''
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [menuOpen])

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    if (variant === 'temp1') {
        const logoSrc =
            resolveThemeAssetUrl(page.branding.logo?.onDark?.src) ||
            resolveThemeAssetUrl(page.branding.logo?.default?.src)
        const elevated = scrolled || !overlay

        return (
            <>
                <header className="fixed inset-x-0 top-6 z-50 pt-3 md:pt-4">
                    <div className="site-container">
                        <div
                            className={cn(
                                'flex h-[64px] items-center justify-between gap-4 px-3 transition-all duration-300 ease-out sm:h-[72px] sm:px-4',
                                elevated
                                    ? 'rounded-xl border border-white/10 bg-black/55 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-md'
                                    : 'rounded-2xl border border-transparent bg-transparent'
                            )}
                        >
                            <div className="flex min-w-0 items-center gap-2">
                                <button
                                    type="button"
                                    aria-label="Open menu"
                                    aria-expanded={menuOpen}
                                    onClick={() => setMenuOpen(true)}
                                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition hover:bg-white/10 lg:hidden"
                                >
                                    <TwoLineMenu />
                                </button>

                                <AgencyLink
                                    href="/"
                                    aria-label={brand}
                                    className="inline-flex max-w-[160px] items-center shrink-0 sm:max-w-[200px]"
                                >
                                    <BrandMark
                                        brand={brand}
                                        logoSrc={logoSrc}
                                        className="text-white"
                                    />
                                </AgencyLink>
                            </div>

                            <nav className="hidden items-center gap-7 text-[0.92rem] text-white/80 lg:flex">
                                {NAV.map((item) => (
                                    <AgencyLink
                                        key={item.label}
                                        href={item.href}
                                        className="transition hover:text-white"
                                    >
                                        {item.label}
                                    </AgencyLink>
                                ))}
                            </nav>

                            <div className="flex items-center gap-2.5 sm:gap-3">
                                {!user ? (
                                    <AgencyLink
                                        href="/login"
                                        className="rounded-full border border-white/35 px-4 py-2 text-sm text-white transition hover:border-white/60 hover:bg-white/10"
                                    >
                                        Log in
                                    </AgencyLink>
                                ) : null}
                                {user ? <ProfileMenu /> : null}
                            </div>
                        </div>
                    </div>
                </header>
                {!overlay ? (
                    <div className="h-[88px] md:h-[96px]" aria-hidden />
                ) : null}

                <div
                    className={cn(
                        'fixed inset-0 z-[60] lg:hidden',
                        menuOpen ? 'pointer-events-auto' : 'pointer-events-none'
                    )}
                    aria-hidden={!menuOpen}
                >
                    <button
                        type="button"
                        aria-label="Close menu"
                        onClick={() => setMenuOpen(false)}
                        className={cn(
                            'absolute inset-0 bg-black/40 transition-opacity duration-300',
                            menuOpen ? 'opacity-100' : 'opacity-0'
                        )}
                    />
                    <aside
                        className={cn(
                            'absolute inset-y-0 left-0 flex w-[min(86vw,320px)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out',
                            menuOpen ? 'translate-x-0' : '-translate-x-full'
                        )}
                    >
                        <div className="flex h-[72px] items-center justify-between gap-3 border-b border-black/5 px-4">
                            <AgencyLink
                                href="/"
                                aria-label={brand}
                                onClick={() => setMenuOpen(false)}
                                className="inline-flex max-w-[180px] items-center"
                            >
                                <BrandMark
                                    brand={brand}
                                    logoSrc={
                                        resolveThemeAssetUrl(
                                            page.branding.logo?.default?.src
                                        ) ||
                                        resolveThemeAssetUrl(
                                            page.branding.logo?.onDark?.src
                                        )
                                    }
                                />
                            </AgencyLink>
                            <button
                                type="button"
                                aria-label="Close menu"
                                onClick={() => setMenuOpen(false)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#111] transition hover:bg-black/5"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
                            {NAV.map((item) => (
                                <AgencyLink
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setMenuOpen(false)}
                                    className="rounded-xl px-3.5 py-3 text-[0.95rem] font-medium text-[#222] transition hover:bg-black/[0.04]"
                                >
                                    {item.label}
                                </AgencyLink>
                            ))}
                        </nav>

                        {!user ? (
                            <div className="border-t border-black/5 p-4">
                                <AgencyLink
                                    href="/login"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex w-full items-center justify-center rounded-full border border-black/10 px-5 py-2.5 text-sm font-medium text-[#111] transition hover:bg-black/[0.03]"
                                >
                                    Log in
                                </AgencyLink>
                            </div>
                        ) : null}
                    </aside>
                </div>
            </>
        )
    }

    if (variant === 'temp2') {
        const logoSrc =
            resolveThemeAssetUrl(page.branding.logo?.default?.src) ||
            resolveThemeAssetUrl(page.branding.logo?.onDark?.src)

        return (
            <>
                <header className="sticky top-0 z-50 border-b border-black/5 bg-[#FCF8F3]/95 backdrop-blur">
                    <div className="site-container flex h-[72px] items-center justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-2">
                            <button
                                type="button"
                                aria-label="Open menu"
                                aria-expanded={menuOpen}
                                onClick={() => setMenuOpen(true)}
                                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#111] transition hover:bg-black/5 lg:hidden"
                            >
                                <TwoLineMenu />
                            </button>

                            <AgencyLink
                                href="/"
                                aria-label={brand}
                                className="inline-flex max-w-[160px] items-center shrink-0 sm:max-w-[200px]"
                            >
                                <BrandMark brand={brand} logoSrc={logoSrc} />
                            </AgencyLink>
                        </div>

                        <nav className="hidden items-center gap-7 text-[0.92rem] text-[#222]/80 lg:flex">
                            {NAV.map((item) => (
                                <AgencyLink
                                    key={item.label}
                                    href={item.href}
                                    className="transition hover:text-[#111]"
                                >
                                    {item.label}
                                </AgencyLink>
                            ))}
                        </nav>

                        <div className="flex items-center gap-2.5 sm:gap-3">
                            {!user ? (
                                <AgencyLink
                                    href="/login"
                                    className="hidden text-sm text-[#222]/80 transition hover:text-[#111] sm:inline"
                                >
                                    Log in
                                </AgencyLink>
                            ) : null}
                            <AgencyLink
                                href={ctaHref}
                                className={cn(
                                    'rounded-full bg-[#111] px-4 py-2.5 text-sm font-medium text-white sm:px-5',
                                    'transition hover:bg-[#333]'
                                )}
                            >
                                Book Now
                            </AgencyLink>
                            {user ? <ProfileMenu /> : null}
                        </div>
                    </div>
                </header>

                {/* Mobile sidebar */}
                <div
                    className={cn(
                        'fixed inset-0 z-[60] lg:hidden',
                        menuOpen ? 'pointer-events-auto' : 'pointer-events-none'
                    )}
                    aria-hidden={!menuOpen}
                >
                    <button
                        type="button"
                        aria-label="Close menu"
                        onClick={() => setMenuOpen(false)}
                        className={cn(
                            'absolute inset-0 bg-black/40 transition-opacity duration-300',
                            menuOpen ? 'opacity-100' : 'opacity-0'
                        )}
                    />
                    <aside
                        className={cn(
                            'absolute inset-y-0 left-0 flex w-[min(86vw,320px)] flex-col bg-[#FCF8F3] shadow-2xl transition-transform duration-300 ease-out',
                            menuOpen ? 'translate-x-0' : '-translate-x-full'
                        )}
                    >
                        <div className="flex h-[72px] items-center justify-between gap-3 border-b border-black/5 px-4">
                            <AgencyLink
                                href="/"
                                aria-label={brand}
                                onClick={() => setMenuOpen(false)}
                                className="inline-flex max-w-[180px] items-center"
                            >
                                <BrandMark brand={brand} logoSrc={logoSrc} />
                            </AgencyLink>
                            <button
                                type="button"
                                aria-label="Close menu"
                                onClick={() => setMenuOpen(false)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#111] transition hover:bg-black/5"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
                            {NAV.map((item) => (
                                <AgencyLink
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setMenuOpen(false)}
                                    className="rounded-xl px-3.5 py-3 text-[0.95rem] font-medium text-[#222] transition hover:bg-black/[0.04]"
                                >
                                    {item.label}
                                </AgencyLink>
                            ))}
                        </nav>

                        <div className="space-y-2 border-t border-black/5 p-4">
                            {!user ? (
                                <AgencyLink
                                    href="/login"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex w-full items-center justify-center rounded-full border border-black/10 px-5 py-2.5 text-sm font-medium text-[#111]"
                                >
                                    Log in
                                </AgencyLink>
                            ) : null}
                            <AgencyLink
                                href={ctaHref}
                                onClick={() => setMenuOpen(false)}
                                className="flex w-full items-center justify-center rounded-full bg-[#111] px-5 py-2.5 text-sm font-medium text-white"
                            >
                                Book Now
                            </AgencyLink>
                        </div>
                    </aside>
                </div>
            </>
        )
    }

    return null
}
