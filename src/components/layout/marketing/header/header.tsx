'use client'

import { Button } from '@/components/ui/button'
import { ProfileMenu } from '@/components/layout/marketing/header/ProfileMenu'
import type { HomepagePage } from '@/data/homepage'
import { HP_CSS_VARS, HP_THEME_BTN_CLASS, HP_THEME_BTN_STYLE, STATIC_UI_COLORS } from '@/data/homepage'
import { useInternalPathname, usePrefixedHref } from '@/hooks/useAgencyPreviewBase'
import { useIsAgencySite } from '@/hooks/useIsAgencySite'
import { cn } from '@/lib/utils/clsxUtils'
import { useLogout, useOptionalUser } from '@/services/auth/auth.queries'
import { StorageMediaImage } from '@/components/ui/storage-media-image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type HeaderProps = {
    page: HomepagePage
}

function isNavLinkActive(pathname: string, href: string | null | undefined): boolean {
    if (!href) return false
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
}

const LIGHT_NAV_LINK_COLOR = '#00292C'

const navLinkClassName = (isActive: boolean, useLightNav: boolean) =>
    cn(
        'group relative inline-block pb-1 text-sm font-normal transition duration-200 xl:text-base',
        useLightNav ? 'hover:opacity-80' : 'hover:opacity-90',
        isActive && 'font-medium',
    )

type HeaderNavLinkProps = {
    href: string
    label: string
    useLightNav: boolean
    color: string
    onNavigate?: () => void
    className?: string
}

function HeaderNavLink({
    href,
    label,
    useLightNav,
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
                className ?? navLinkClassName(isActive, useLightNav),
                !className && useLightNav && 'text-[#00292C]',
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
    const useLightNav = isTermsPage || isDashboardPage || isBookingsPage
    const isAgencySite = useIsAgencySite()
    const { data: currentUser } = useOptionalUser()
    const { mutateAsync: logout } = useLogout()
    const isLoggedIn = !!currentUser
    const showAuthActions = isAgencySite === true

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(useLightNav)

    const { header, branding } = page
    const colors = STATIC_UI_COLORS
    const loginHref = usePrefixedHref(header.auth.login.href ?? '/login') ?? '/login'
    const signUpHref = usePrefixedHref(header.auth.signUp.href ?? '/register') ?? '/register'
    const dashboardHref = usePrefixedHref('/dashboard') ?? '/dashboard'

    useEffect(() => {
        if (useLightNav) {
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
    }, [useLightNav])

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

    const logoutButtonClassName = cn(
        'w-max',
        useLightNav ? 'hover:opacity-80' : 'hover:opacity-90',
    )

    const logoutButtonStyle = {
        color: useLightNav ? HP_CSS_VARS.primary : colors.textOnDark,
        fontFamily: 'var(--hp-font-body)',
    }

    const renderLoggedInAuthAction = () =>
        isDashboardPage ? (
            <Button
                variant='transparent'
                size='nav'
                className={logoutButtonClassName}
                style={logoutButtonStyle}
                onClick={handleLogout}
            >
                {header.auth.logout.label}
            </Button>
        ) : (
            <ProfileMenu
                useLightNav={useLightNav}
                logoutLabel={header.auth.logout.label}
                onLogout={handleLogout}
            />
        )

    return (
        <>
            <header
                className={cn(
                    'pointer-events-auto z-[100] ease duration-300',
                    useLightNav
                        ? 'fixed top-0 left-0 right-0 w-full border-b'
                        : 'fixed rounded-xl 2xl:left-[110px] 2xl:right-[110px] 2xl:top-[50px] lg:left-12 lg:right-12 lg:top-12 sm:right-8 sm:left-8 sm:top-8 xs:left-7 xs:right-7 xs:top-7 top-7 left-4 right-4',
                    useLightNav
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
                <div className={cn(useLightNav ? 'mx-auto w-full max-w-[1182px] px-[15px]' : '')}>
                <div className='flex w-full items-center justify-between gap-4'>
                    {/* Logo  */}
                    <div>
                        <StorageMediaImage
                            src={
                                useLightNav
                                    ? branding.logo.default.src
                                    : branding.logo.onDark.src
                            }
                            alt={branding.logo.default.alt}
                            width={150}
                            height={100}
                            className={cn(
                                'object-contain transition-all duration-300 max-w-[150px] object-left',
                                isScrolled
                                    ? 'w-auto max-h-[50px]'
                                    : 'max-h-[100px] min-h-[50px] w-[90px] sm:w-[110px] lg:w-[130px] xl:w-[150px]',
                            )}
                            priority
                            fetchPriority='high'
                            quality={100}
                        />
                    </div>

                    {/* Navigations + Buttons  */}
                    <nav className='hidden flex-1 items-center justify-end lg:flex'>
                        <div className='flex items-center gap-[54px]'>
                            {header.navigation.map((link) => (
                                <HeaderNavLink
                                    key={link.href}
                                    href={link.href ?? '/'}
                                    label={link.label}
                                    useLightNav={useLightNav}
                                    color={useLightNav ? LIGHT_NAV_LINK_COLOR : colors.textOnDark}
                                />
                            ))}
                        </div>


                        {/* Buttons  */}
                        {showAuthActions ? (
                            <div className='ml-10 flex items-center gap-10'>
                                {isLoggedIn ? (
                                    renderLoggedInAuthAction()
                                ) : (
                                    <>
                                        <HeaderNavLink
                                            href={header.auth.login.href ?? '/login'}
                                            label={header.auth.login.label}
                                            useLightNav={useLightNav}
                                            color={useLightNav ? HP_CSS_VARS.primary : colors.textOnDark}
                                        />
                                        <Button
                                            variant='secondary'
                                            style={useLightNav ? HP_THEME_BTN_STYLE : undefined}
                                            className={cn('w-max', useLightNav && HP_THEME_BTN_CLASS)}
                                            href={signUpHref}
                                        >
                                            {header.auth.signUp.label}
                                        </Button>
                                    </>
                                )}
                            </div>
                        ) : null}
                    </nav>

                    {/* Mobile profile + menu trigger */}
                    <div className='flex items-center gap-2 lg:hidden'>
                        {showAuthActions && isLoggedIn ? renderLoggedInAuthAction() : null}
                        <button
                            type='button'
                            aria-label={header.mobileMenu.openLabel}
                            aria-expanded={isMobileMenuOpen}
                            onClick={() => setIsMobileMenuOpen(true)}
                            className={cn(
                                'group flex h-10 w-10 items-center justify-center rounded-md transition',
                                useLightNav ? 'hover:opacity-90' : 'bg-white/10 backdrop-blur-sm hover:bg-white/20',
                            )}
                        >
                            <span className='flex flex-col items-end gap-[5px]'>
                                <span
                                    className='h-[2.5px] w-6 rounded-full transition-transform duration-300 group-hover:translate-x-[1px]'
                                    style={{
                                        backgroundColor: useLightNav ? HP_CSS_VARS.primary : colors.textOnDark,
                                    }}
                                />
                                <span
                                    className='h-[2.5px] w-4 rounded-full transition-transform duration-300 group-hover:-translate-x-[1px]'
                                    style={{
                                        backgroundColor: useLightNav ? HP_CSS_VARS.primary : colors.textOnDark,
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
                        'absolute right-0 top-0 z-10 flex h-full w-[min(88vw,360px)] flex-col bg-primary-500 px-5 pb-6 pt-5 shadow-2xl transition-transform duration-300 sm:px-6',
                        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full',
                    )}
                >
                    <div className='flex items-center justify-between'>
                        <StorageMediaImage
                            src={branding.logo.onDark.src}
                            alt={branding.logo.onDark.alt}
                            width={150}
                            height={100}
                            className='h-auto w-[60px] sm:w-[70px] lg:w-[80px] xl:w-[95px]'
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

                    <nav className='mt-10 flex flex-1 flex-col gap-2'>
                        {header.navigation.map((link) => (
                            <HeaderNavLink
                                key={link.href}
                                href={link.href ?? '/'}
                                label={link.label}
                                useLightNav={useLightNav}
                                color={colors.textOnDark}
                                onNavigate={() => setIsMobileMenuOpen(false)}
                                className='rounded-lg px-3 py-3 text-base font-medium text-white transition hover:bg-white/15'
                            />
                        ))}
                    </nav>

                    {showAuthActions ? (
                        <div className='flex flex-col gap-3 pt-4'>
                            {isLoggedIn ? (
                                isDashboardPage ? (
                                    <Button
                                        variant='transparent'
                                        className='!w-full rounded-md border border-white/35 text-white hover:bg-white/10'
                                        onClick={handleLogout}
                                    >
                                        {header.auth.logout.label}
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            variant='secondary'
                                            className='!w-full rounded-md bg-white text-primary-700'
                                            href={dashboardHref}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Dashboard
                                        </Button>
                                        <Button
                                            variant='transparent'
                                            className='!w-full rounded-md border border-white/35 text-white hover:bg-white/10'
                                            onClick={handleLogout}
                                        >
                                            {header.auth.logout.label}
                                        </Button>
                                    </>
                                )
                            ) : (
                                <div className='flex items-center gap-3'>
                                    <Button
                                        variant='transparent'
                                        className='flex-1 !w-full rounded-md border border-white/35 text-white hover:bg-white/10'
                                        href={loginHref}
                                    >
                                        {header.auth.login.label}
                                    </Button>
                                    <Button
                                        variant='secondary'
                                        className='flex-1 !w-full rounded-md bg-white text-primary-700'
                                        href={signUpHref}
                                    >
                                        {header.auth.signUp.label}
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : null}
                </aside>
            </div>
        </>
    )
}

export default Header