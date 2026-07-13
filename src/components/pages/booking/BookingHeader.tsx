'use client'

import { Button } from '@/components/ui/button'
import { ProfileMenu } from '@/components/layout/marketing/header/ProfileMenu'
import { AccountNavLinks } from '@/components/pages/dashboard/AccountNavLinks'
import { getBrandingLogo } from '@/lib/homepage/branding-logo'
import { resolveNavLinkDisplayLabel } from '@/lib/homepage/nav-labels'
import { useHomepagePageWithFallback } from '@/hooks/useHomepagePageWithFallback'
import { useInternalPathname, usePreviewRouter } from '@/hooks/useAgencyPreviewBase'
import { cn } from '@/lib/utils/clsxUtils'
import { useLogout, useOptionalUser } from '@/services/auth/auth.queries'
import {
    selectHomepageAgencyId,
    selectHomepageThemeUpdatedAt,
    selectIsAgencySite,
} from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'
import { trackLogoutEvent } from '@/services/events/events.service'
import { useState } from 'react'

import { HomepageMediaImage } from '@/components/ui/homepage-media-image'
import { PrefixedLink } from '@/components/ui/prefixed-link'


function isNavLinkActive(pathname: string, href: string | null | undefined): boolean {
    if (!href) return false
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
}

function resolveNavHref(href: string | null | undefined): string {
    const trimmed = href?.trim()
    if (!trimmed || trimmed === '#') return '/'
    return trimmed
}

export function BookingHeader() {
    const internalPathname = useInternalPathname()
    const router = usePreviewRouter()
    const page = useHomepagePageWithFallback()
    const themeUpdatedAt = useAppSelector(selectHomepageThemeUpdatedAt)
    const { data: currentUser } = useOptionalUser()
    const { mutateAsync: logout } = useLogout()
    const isAgencySite = useAppSelector(selectIsAgencySite)
    const agencyId = useAppSelector(selectHomepageAgencyId)
    const isLoggedIn = !!currentUser
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleLogout = async () => {
        await trackLogoutEvent(agencyId)
        await logout()
        setIsMobileMenuOpen(false)
        router.push('/login')
        router.refresh()
    }

    if (!page) return null

    const { header, branding } = page
    const headerLogo = getBrandingLogo(branding, 'default', themeUpdatedAt)
    const logoutLabel = header.auth?.logout?.label ?? 'Logout'

    return (
        <>
            <header className='relative z-10 bg-white'>
                <div className='agency-container flex h-[118px] items-center justify-between gap-4'>
                    <PrefixedLink
                        href='/'
                        className='flex shrink-0 items-center gap-3'
                    >
                        <HomepageMediaImage
                            key={headerLogo.src}
                            src={headerLogo.src}
                            alt={headerLogo.alt}
                            width={150}
                            height={100}
                            className='h-11 w-auto max-w-[150px] object-contain sm:h-11'
                            priority
                            unoptimized
                        />
                    </PrefixedLink>

                    <div className='flex items-center gap-4 lg:gap-8'>
                        <nav
                            className='hidden items-center gap-6 lg:flex xl:gap-8'
                            aria-label='Main navigation'
                        >
                            {header.navigation.map((link) => {
                                const href = resolveNavHref(link.href)
                                const isActive = isNavLinkActive(internalPathname, href)

                                return (
                                    <PrefixedLink
                                        key={`${link.label}-${href}`}
                                        href={href}
                                        className={cn(
                                            'inline-flex text-sm font-normal text-[#00292C] transition-colors hover:opacity-80 xl:text-base',
                                            isActive && 'font-medium',
                                        )}
                                    >
                                        {resolveNavLinkDisplayLabel(link.label, href)}
                                    </PrefixedLink>
                                )
                            })}
                        </nav>

                        <div className='flex items-center gap-2'>
                            {isLoggedIn ? (
                                <ProfileMenu
                                    useLightNav
                                    logoutLabel={logoutLabel}
                                    onLogout={handleLogout}
                                />
                            ) : (
                                <Button
                                    variant='transparent'
                                    size='nav'
                                    className='!w-auto text-neutral-800 hover:bg-transparent'
                                    href={header.auth?.login?.href ?? '/login'}
                                >
                                    {header.auth?.login?.label ?? 'Login'}
                                </Button>
                            )}
                        </div>

                        <button
                            type='button'
                            aria-label={header.mobileMenu.openLabel}
                            aria-expanded={isMobileMenuOpen}
                            onClick={() => setIsMobileMenuOpen(true)}
                            className='flex h-10 w-10 items-center justify-center rounded-md border border-neutral-300/80 bg-white/80 lg:hidden'
                        >
                            <span className='flex flex-col items-end gap-[5px]'>
                                <span className='h-[2.5px] w-6 rounded-full bg-neutral-800' />
                                <span className='h-[2.5px] w-4 rounded-full bg-neutral-800' />
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            {isMobileMenuOpen ? (
                <div className='fixed inset-0 z-[110] lg:hidden'>
                    <button
                        type='button'
                        aria-label={header.mobileMenu.overlayCloseLabel}
                        className='absolute inset-0 bg-black/45 backdrop-blur-[2px]'
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <aside className='absolute right-0 top-0 flex h-full w-[min(88vw,360px)] flex-col bg-white px-5 pb-6 pt-5 shadow-2xl'>
                        <div className='flex items-center justify-between'>
                            <HomepageMediaImage
                                key={headerLogo.src}
                                src={headerLogo.src}
                                alt={headerLogo.alt}
                                width={150}
                                height={100}
                                className='h-auto w-[80px] object-contain'
                                unoptimized
                            />
                            <button
                                type='button'
                                aria-label={header.mobileMenu.closeLabel}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className='flex h-9 w-9 items-center justify-center rounded-md text-2xl leading-none text-neutral-700'
                            >
                                &times;
                            </button>
                        </div>

                        <nav className='mt-8 flex flex-1 flex-col gap-1'>
                            {header.navigation.map((link) => {
                                const href = resolveNavHref(link.href)

                                return (
                                    <PrefixedLink
                                        key={`${link.label}-${href}`}
                                        href={href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className='rounded-lg px-3 py-3 text-base font-medium text-neutral-800 transition hover:bg-neutral-100'
                                    >
                                        {resolveNavLinkDisplayLabel(link.label, href)}
                                    </PrefixedLink>
                                )
                            })}
                            {isLoggedIn ? (
                                <>
                                    <div className='my-2 h-px shrink-0 bg-neutral-200' aria-hidden />
                                    <AccountNavLinks
                                        variant='drawer'
                                        drawerTone='light'
                                        onNavigate={() => setIsMobileMenuOpen(false)}
                                    />
                                </>
                            ) : null}
                        </nav>

                        <div className='flex flex-col gap-3 pt-4'>
                            {isLoggedIn ? (
                                <Button
                                    variant='outline'
                                    className='!w-full rounded-md'
                                    onClick={handleLogout}
                                >
                                    {logoutLabel}
                                </Button>
                            ) : (
                                <div className='flex flex-col gap-3'>
                                    <Button
                                        variant='outline'
                                        className='!w-full rounded-md'
                                        href={header.auth?.login?.href ?? '/login'}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {header.auth?.login?.label ?? 'Login'}
                                    </Button>
                                    {!isAgencySite ? (
                                        <Button
                                            variant='secondary'
                                            className='!w-full rounded-md'
                                            href={header.auth?.signUp?.href ?? '/register'}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {header.auth?.signUp?.label ?? 'Sign Up'}
                                        </Button>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            ) : null}
        </>
    )
}
