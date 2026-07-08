'use client'

import { Button } from '@/components/ui/button'
import { ProfileMenu } from '@/components/layout/marketing/header/ProfileMenu'
import { AccountNavLinks } from '@/components/pages/dashboard/AccountNavLinks'
import type { HomepagePage } from '@/data/homepage'
import {
    HP_CSS_VARS,
    HP_OUTLINE_BTN_STYLE,
    HP_THEME_BG_CLASS,
    HP_THEME_OUTLINE_BTN_CLASS,
    STATIC_UI_COLORS,
} from '@/data/homepage'
import { useInternalPathname, usePrefixedHref } from '@/hooks/useAgencyPreviewBase'
import { getTourOrPackageCopy, usesHajjUmrahBanner } from '@/lib/homepage/specialization'
import { cn } from '@/lib/utils/clsxUtils'
import { useLogout, useOptionalUser } from '@/services/auth/auth.queries'
import {
    selectHomepageSpecializationId,
    selectHomepageSpecializations,
} from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'
import {
    headerLogoClassName,
    mobileDrawerLogoClassName,
} from '@/components/layout/marketing/header/header-logo-classes'
import { HomepageMediaImage } from '@/components/ui/homepage-media-image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type HeaderProps = {
    page: HomepagePage
}

function matchesRoute(pathname: string, route: string): boolean {
    return pathname === route || pathname.startsWith(`${route}/`)
}

function shouldUseDarkLogo(pathname: string): boolean {
    return (
        matchesRoute(pathname, '/profile') ||
        matchesRoute(pathname, '/dashboard') ||
        matchesRoute(pathname, '/bookings') ||
        matchesRoute(pathname, '/booking')
    )
}

function isNavLinkActive(pathname: string, href: string | null | undefined): boolean {
    if (!href) return false
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
}

const LIGHT_NAV_LINK_COLOR = '#00292C'

const FLOATING_HEADER_POSITION_CLASS =
    'fixed rounded-xl top-7 left-4 right-4 xs:left-7 xs:right-7 xs:top-7 sm:left-8 sm:right-8 sm:top-8 lg:left-12 lg:right-12 lg:top-12 2xl:left-[110px] 2xl:right-[110px] 2xl:top-[50px]'

/** Tighter top inset on light pages (no hero) — dashboard, bookings, checkout. */
const COMPACT_FLOATING_HEADER_POSITION_CLASS =
    'fixed rounded-xl top-3 left-4 right-4 xs:left-6 xs:right-6 xs:top-4 sm:left-8 sm:right-8 sm:top-5 lg:left-12 lg:right-12 lg:top-6 2xl:left-[110px] 2xl:right-[110px] 2xl:top-8'

const navLinkClassName = (isActive: boolean, useDarkChrome: boolean) =>
    cn(
        'group relative inline-block pb-1 text-sm font-normal transition duration-200 xl:text-base',
        useDarkChrome ? 'hover:opacity-80' : 'hover:opacity-90',
        isActive && 'font-medium',
    )

type HeaderNavLinkProps = {
    href: string
    label: string
    useDarkChrome: boolean
    color: string
    onNavigate?: () => void
    className?: string
}

function HeaderNavLink({
    href,
    label,
    useDarkChrome,
    color,
    onNavigate,
    className,
}: HeaderNavLinkProps) {
    const internalPathname = useInternalPathname()
    const resolvedHref = usePrefixedHref(href) ?? href
    const isActive = isNavLinkActive(internalPathname, href)
    const isMobileStyle = Boolean(className)

    return (
        <Link
            href={resolvedHref}
            onClick={onNavigate}
            className={cn(
                className ?? navLinkClassName(isActive, useDarkChrome),
                !className && useDarkChrome && 'text-[#00292C]',
            )}
            style={
                isMobileStyle
                    ? undefined
                    : {
                        color,
                        fontFamily: 'var(--hp-font-body)',
                    }
            }
        >
            {className ? (
                label
            ) : (
                <>
                    <span
                        aria-hidden
                        className={cn(
                            'absolute bottom-0 left-0 h-[2px] w-full origin-left transition-transform duration-200',
                            isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                        )}
                        style={{ backgroundColor: color }}
                    />
                    {label}
                </>
            )}
        </Link>
    )
}

const Header = ({ page }: HeaderProps) => {
    const internalPathname = useInternalPathname()
    const router = useRouter()
    const isTermsPage = internalPathname === '/terms' || internalPathname.startsWith('/terms/')
    const isDashboardPage = internalPathname === '/dashboard' || internalPathname.startsWith('/dashboard/')
    const isBookingsPage = internalPathname === '/bookings' || internalPathname.startsWith('/bookings/')
    const isBookingPage = internalPathname === '/booking' || internalPathname.startsWith('/booking/')
    const isCompactHeaderPage = isDashboardPage || isBookingsPage || isBookingPage
    const useFixedHeader = isTermsPage
    const { data: currentUser } = useOptionalUser()
    const { mutateAsync: logout } = useLogout()
    const isLoggedIn = !!currentUser

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(useFixedHeader)

    const { header, branding } = page
    const specializationId = useAppSelector(selectHomepageSpecializationId)
    const specializations = useAppSelector(selectHomepageSpecializations)
    const isUmrahSite = usesHajjUmrahBanner(specializationId, specializations)
    const listingsNavLabel = getTourOrPackageCopy(isUmrahSite).listingsNavLabel
    const navigation = header.navigation.map((link) =>
        link.href === '/search' ? { ...link, label: listingsNavLabel } : link,
    )
    const colors = STATIC_UI_COLORS
    const headerLogo = shouldUseDarkLogo(internalPathname)
        ? branding.logo.default
        : branding.logo.onDark
    const loginHref = usePrefixedHref(header.auth.login.href ?? '/login') ?? '/login'
    const signUpHref = usePrefixedHref(header.auth.signUp.href ?? '/register') ?? '/register'
    const useDarkChrome = useFixedHeader || (isCompactHeaderPage && !isScrolled)

    useEffect(() => {
        if (useFixedHeader) {
            setIsScrolled(true)
            return
        }

        const scrollContainer = document.getElementById('app-scroll-container')

        const getScrollTop = () => {
            if (scrollContainer) return scrollContainer.scrollTop
            return window.scrollY || document.documentElement.scrollTop || 0
        }

        const onScroll = () => {
            const y = getScrollTop()
            setIsScrolled((prev) => {
                if (!prev && y > 1) return true
                if (prev && y < 1) return false
                return prev
            })
        }

        onScroll()

        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', onScroll, { passive: true })
            return () => scrollContainer.removeEventListener('scroll', onScroll)
        }

        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [useFixedHeader])

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
        const scrollContainer = document.getElementById('app-scroll-container')
        if (scrollContainer) {
            scrollContainer.style.overflowY = isMobileMenuOpen ? 'hidden' : 'auto'
        }
        return () => {
            document.body.style.overflow = ''
            if (scrollContainer) {
                scrollContainer.style.overflowY = 'auto'
            }
        }
    }, [isMobileMenuOpen])

    const handleLogout = async () => {
        await logout()
        setIsMobileMenuOpen(false)
        router.push(loginHref)
        router.refresh()
    }

    const loginButtonClassName = cn(
        'w-max min-w-[120px] border px-5 !font-normal !normal-case !tracking-normal',
        useDarkChrome
            ? HP_THEME_OUTLINE_BTN_CLASS
            : 'border-white bg-transparent text-white hover:bg-white/10',
    )

    const loginButtonStyle = useDarkChrome ? HP_OUTLINE_BTN_STYLE : undefined

    const mobileLoginButtonClassName =
        '!w-full border border-white bg-transparent text-white hover:bg-white/10'

    const renderLoginButton = (options?: { className?: string; onNavigate?: () => void; mobile?: boolean }) => {
        const isMobileMenu = options?.mobile === true

        return (
            <Button
                variant={isMobileMenu || !useDarkChrome ? 'transparent' : 'outline'}
                size='sm'
                href={loginHref}
                onClick={options?.onNavigate}
                style={!isMobileMenu && useDarkChrome ? loginButtonStyle : undefined}
                className={cn(
                    isMobileMenu
                        ? mobileLoginButtonClassName
                        : loginButtonClassName,
                    !isMobileMenu && !useDarkChrome && '!text-white',
                    options?.className,
                )}
            >
                {header.auth.login.label}
            </Button>
        )
    }

    const renderMobileGuestAuthButtons = (onNavigate?: () => void) => (
        <div className='flex flex-col gap-3'>
            {renderLoginButton({ mobile: true, onNavigate })}
            <Button
                variant='default'
                size='sm'
                href={signUpHref}
                onClick={onNavigate}
                className='!w-full'
            >
                {header.auth.signUp.label}
            </Button>
        </div>
    )

    const logoutButtonClassName = cn(
        'w-max min-w-[120px] border px-5 !font-normal !normal-case !tracking-normal',
        useDarkChrome
            ? 'border-[#00292C] bg-white text-[#00292C] hover:bg-[#00292C]/5'
            : 'border-white bg-transparent text-white hover:bg-white/10',
    )

    const logoutButtonStyle = useDarkChrome
        ? {
            backgroundColor: '#FFFFFF',
            borderColor: LIGHT_NAV_LINK_COLOR,
            color: LIGHT_NAV_LINK_COLOR,
            fontFamily: 'var(--hp-font-body)',
        }
        : undefined

    const renderLogoutButton = (options?: { className?: string; onNavigate?: () => void; mobile?: boolean }) => {
        const isMobileMenu = options?.mobile === true

        const onLogoutClick = async () => {
            options?.onNavigate?.()
            await handleLogout()
        }

        return (
            <Button
                variant={isMobileMenu || !useDarkChrome ? 'transparent' : 'outline'}
                size='sm'
                onClick={onLogoutClick}
                style={!isMobileMenu && useDarkChrome ? logoutButtonStyle : undefined}
                className={cn(
                    isMobileMenu
                        ? mobileLoginButtonClassName
                        : logoutButtonClassName,
                    !isMobileMenu && !useDarkChrome && '!text-white',
                    options?.className,
                )}
            >
                {header.auth.logout.label}
            </Button>
        )
    }

    const renderLoggedInAuthAction = () =>
        isDashboardPage ? (
            renderLogoutButton()
        ) : (
            <ProfileMenu
                useLightNav={useDarkChrome}
                logoutLabel={header.auth.logout.label}
                onLogout={handleLogout}
            />
        )

    return (
        <>
            <header
                className={cn(
                    'pointer-events-auto z-[100] ease duration-300',
                    useFixedHeader
                        ? 'fixed top-0 left-0 right-0 w-full border-b'
                        : isCompactHeaderPage
                            ? COMPACT_FLOATING_HEADER_POSITION_CLASS
                            : FLOATING_HEADER_POSITION_CLASS,
                    useFixedHeader
                        ? [
                            'border-[#C0C8C9]/60 bg-white shadow-sm',
                            'py-4',
                        ]
                        : isScrolled
                            ? [
                                "border border-white/15 bg-black/40 shadow-xl shadow-black/30 backdrop-blur-lg",
                                "xl:py-4 xl:px-10 lg:py-4 lg:px-6 sm:py-3 sm:px-5 py-4 px-4"
                            ]
                            : 'border border-transparent bg-transparent',
                )}
            >
                <div className={cn(useFixedHeader ? 'mx-auto w-full max-w-[1182px] px-0 sm:px-[15px]' : '')}>
                    <div className='flex w-full items-center justify-between gap-4'>
                        {/* Logo  */}
                        <Link href='/' className='shrink-0 inline-block'>
                            <HomepageMediaImage
                                key={headerLogo.src}
                                src={headerLogo.src}
                                alt={headerLogo.alt}
                                width={212}
                                height={88}
                                className={headerLogoClassName(isScrolled)}
                                priority
                                fetchPriority='high'
                                quality={100}
                            />
                        </Link>

                        {/* Navigations + Buttons  */}
                        <nav className='hidden flex-1 items-center justify-end lg:flex'>
                            <div className='flex items-center gap-[54px]'>
                                {navigation.map((link) => (
                                    <HeaderNavLink
                                        key={link.href}
                                        href={link.href ?? '/'}
                                        label={link.label}
                                        useDarkChrome={useDarkChrome}
                                        color={useDarkChrome ? LIGHT_NAV_LINK_COLOR : colors.textOnDark}
                                    />
                                ))}
                            </div>


                            {/* Buttons  */}
                            <div className='ml-10 flex items-center'>
                                {isLoggedIn ? renderLoggedInAuthAction() : renderLoginButton()}
                            </div>
                        </nav>

                        {/* Mobile menu trigger (auth actions live inside the drawer) */}
                        <div className='flex items-center gap-2 lg:hidden'>
                            <button
                                type='button'
                                aria-label={header.mobileMenu.openLabel}
                                aria-expanded={isMobileMenuOpen}
                                onClick={() => setIsMobileMenuOpen(true)}
                                className={cn(
                                    'group flex h-10 w-10 items-center justify-center rounded-md transition',
                                    useDarkChrome ? 'hover:opacity-90' : 'bg-white/10 backdrop-blur-sm hover:bg-white/20',
                                )}
                            >
                                <span className='flex flex-col items-end gap-[5px]'>
                                    <span
                                        className='h-[2.5px] w-6 rounded-full transition-transform duration-300 group-hover:translate-x-[1px]'
                                        style={{
                                            backgroundColor: useDarkChrome ? HP_CSS_VARS.primary : colors.textOnDark,
                                        }}
                                    />
                                    <span
                                        className='h-[2.5px] w-4 rounded-full transition-transform duration-300 group-hover:-translate-x-[1px]'
                                        style={{
                                            backgroundColor: useDarkChrome
                                                ? HP_CSS_VARS.primary
                                                : colors.textOnDark,
                                        }}
                                    />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile drawer + overlay */}
            <div
                className={cn(
                    'fixed inset-0 z-[200] transition-opacity duration-300 lg:hidden',
                    isMobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
                )}
            >
                <button
                    type='button'
                    aria-label={header.mobileMenu.overlayCloseLabel}
                    className='absolute inset-0 z-0 bg-black/45 backdrop-blur-[2px]'
                    onClick={() => setIsMobileMenuOpen(false)}
                />

                <aside
                    className={cn(
                        'absolute right-0 top-0 z-10 flex h-full w-[min(88vw,360px)] flex-col px-5 pb-6 pt-5 shadow-2xl transition-transform duration-300 sm:px-6',
                        HP_THEME_BG_CLASS,
                        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full',
                    )}
                >
                    <div className='flex items-center justify-between'>
                        <HomepageMediaImage
                            src={branding.logo.onDark.src}
                            alt={branding.logo.onDark.alt}
                            width={128}
                            height={48}
                            className={mobileDrawerLogoClassName()}
                            quality={100}
                        />
                        <button
                            type='button'
                            aria-label={header.mobileMenu.closeLabel}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className='flex h-9 w-9 items-center justify-center rounded-md bg-white/15 text-white transition hover:bg-white/25'
                        >
                            <span className='text-xl leading-none'>&times;</span>
                        </button>
                    </div>

                    <nav className='mt-10 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto'>
                        {navigation.map((link) => (
                            <HeaderNavLink
                                key={link.href}
                                href={link.href ?? '/'}
                                label={link.label}
                                useDarkChrome={false}
                                color={colors.textOnDark}
                                onNavigate={() => setIsMobileMenuOpen(false)}
                                className='rounded-lg px-3 py-3 text-base font-medium text-white transition hover:bg-white/15'
                            />
                        ))}

                        {isLoggedIn ? (
                            <>
                                <div className='my-2 h-px shrink-0 bg-white/20' aria-hidden />
                                <AccountNavLinks
                                    variant='drawer'
                                    onNavigate={() => setIsMobileMenuOpen(false)}
                                />
                            </>
                        ) : null}
                    </nav>

                    <div className='flex shrink-0 flex-col gap-3 border-t border-white/15 pt-4'>
                        {isLoggedIn
                            ? renderLogoutButton({ mobile: true, onNavigate: () => setIsMobileMenuOpen(false) })
                            : renderMobileGuestAuthButtons(() => setIsMobileMenuOpen(false))}
                    </div>
                </aside>
            </div>
        </>
    )
}

export default Header