'use client'

import { Button } from '@/components/ui/button'
import { ProfileMenu } from '@/components/layout/marketing/header/ProfileMenu'
import { useHomepagePageWithFallback } from '@/hooks/useHomepagePageWithFallback'
import { useIsAgencySite } from '@/hooks/useIsAgencySite'
import { cn } from '@/lib/utils/clsxUtils'
import { useLogout, useUser } from '@/services/auth/auth.queries'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

function isNavLinkActive(pathname: string, href: string | null | undefined): boolean {
    if (!href) return false
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
}

export function BookingHeader() {
    const pathname = usePathname()
    const router = useRouter()
    const page = useHomepagePageWithFallback()
    const isAgencySite = useIsAgencySite()
    const { data: currentUser } = useUser()
    const { mutateAsync: logout } = useLogout()
    const isLoggedIn = !!currentUser
    const showAuthActions = isAgencySite === true
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleLogout = async () => {
        await logout()
        setIsMobileMenuOpen(false)
        router.push('/login')
        router.refresh()
    }

    if (!page) return null

    const { header, branding } = page

    return (
        <>
            <header className='relative z-20 border-b border-white/30 bg-transparent'>
                <div className='agency-container flex h-[118px] items-center justify-between gap-4'>
                    <Link href='/' className='relative z-20 flex shrink-0 items-center gap-3'>
                        <Image
                            src={branding.logo.default.src}
                            alt={branding.logo.default.alt}
                            width={branding.logo.default.width}
                            height={branding.logo.default.height}
                            className='h-11 w-auto max-w-[150px] object-contain sm:h-11'
                            priority
                        />
                    </Link>

                    <div className='relative z-20 flex items-center gap-4 lg:gap-8'>
                        <nav
                            className='hidden items-center gap-6 lg:flex xl:gap-8'
                            aria-label='Main navigation'
                        >
                            {header.navigation.map((link) => {
                                const href = link.href ?? '/'
                                const isActive = isNavLinkActive(pathname, href)

                                return (
                                    <Link
                                        key={link.href}
                                        href={href}
                                        className={cn(
                                            'text-sm font-normal text-neutral-800 transition-colors hover:text-primary-700 xl:text-base',
                                            isActive && 'font-medium text-primary-700',
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                )
                            })}
                        </nav>

                        {showAuthActions ? (
                            <div className='flex items-center gap-2'>
                                {isLoggedIn ? (
                                    <ProfileMenu
                                        useLightNav
                                        logoutLabel={header.auth.logout.label}
                                        onLogout={handleLogout}
                                    />
                                ) : (
                                    <div className='hidden items-center gap-3 sm:flex'>
                                        <Button
                                            variant='transparent'
                                            className='!h-auto !min-h-0 !w-auto !px-0 text-sm text-neutral-800 hover:bg-transparent'
                                            href={header.auth.login.href ?? '/login'}
                                        >
                                            {header.auth.login.label}
                                        </Button>
                                        <Button
                                            variant='secondary'
                                            className='h-10 rounded-sm px-4 text-sm'
                                            href={header.auth.signUp.href ?? '/register'}
                                        >
                                            {header.auth.signUp.label}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : null}

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

            <div
                className={cn(
                    'fixed inset-0 z-[110] transition-opacity duration-300 lg:hidden',
                    isMobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
                )}
            >
                <button
                    type='button'
                    aria-label={header.mobileMenu.overlayCloseLabel}
                    className='absolute inset-0 bg-black/45 backdrop-blur-[2px]'
                    onClick={() => setIsMobileMenuOpen(false)}
                />
                <aside
                    className={cn(
                        'absolute right-0 top-0 flex h-full w-[min(88vw,360px)] flex-col bg-white px-5 pb-6 pt-5 shadow-2xl transition-transform duration-300',
                        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full',
                    )}
                >
                    <div className='flex items-center justify-between'>
                        <Image
                            src={branding.logo.default.src}
                            alt={branding.logo.default.alt}
                            width={branding.logo.default.width}
                            height={branding.logo.default.height}
                            className='h-auto w-[80px] object-contain'
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
                        {header.navigation.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href ?? '/'}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className='rounded-lg px-3 py-3 text-base font-medium text-neutral-800 transition hover:bg-neutral-100'
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {showAuthActions ? (
                        <div className='flex flex-col gap-3 pt-4'>
                            {isLoggedIn ? (
                                <>
                                    <Button
                                        variant='secondary'
                                        className='!w-full rounded-md'
                                        href='/dashboard'
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Button>
                                    <Button
                                        variant='outline'
                                        className='!w-full rounded-md'
                                        onClick={handleLogout}
                                    >
                                        {header.auth.logout.label}
                                    </Button>
                                </>
                            ) : (
                                <div className='flex flex-col gap-3'>
                                    <Button
                                        variant='outline'
                                        className='!w-full rounded-md'
                                        href={header.auth.login.href ?? '/login'}
                                    >
                                        {header.auth.login.label}
                                    </Button>
                                    <Button
                                        variant='secondary'
                                        className='!w-full rounded-md'
                                        href={header.auth.signUp.href ?? '/register'}
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
