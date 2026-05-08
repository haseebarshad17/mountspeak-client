'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/clsxUtils'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    const AgencyNavigationLinks = [
        {
            label: 'Home',
            href: '/',
        },
        {
            label: 'Discover',
            href: '/discover',
        },
        {
            label: 'About Us',
            href: '/about-us',
        },
        {
            label: 'Contact',
            href: '/contact-us',
        },
    ]


    useEffect(() => {
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
    }, [])

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

    return (
        <>
            <header
                className={cn(
                    'fixed z-50 rounded-xl ease duration-300 sm:left-6 sm:right-6 2xl:left-[110px] 2xl:right-[110px] 2xl:top-[50px]',
                    "lg:left-12 lg:right-12 lg:top-12 sm:right-8 sm:left-8 sm:top-8 xs:left-7 xs:right-7 xs:top-7",
                    "top-7 left-4 right-4",
                    isScrolled
                        ? [
                            "border border-white/15 bg-black/40 shadow-xl shadow-black/30 backdrop-blur-lg",
                            "xl:py-4 xl:px-10 lg:py-4 lg:px-6 sm:py-3 sm:px-5 py-4 px-4"
                        ]
                        : 'border border-transparent bg-transparent'
                )}
            >
                <div className='flex w-full items-center justify-between gap-4'>
                    {/* Logo  */}
                    <div>
                        <Image
                            src={'/images/generic/agency-logo.png'}
                            alt='logo'
                            width={100}
                            height={100}
                            className='h-auto w-[60px] sm:w-[70px] lg:w-[80px] xlw-[95px]'
                            priority
                            fetchPriority='high'
                            quality={100}
                        />
                    </div>

                    {/* Navigations + Buttons  */}
                    <nav className='hidden flex-1 items-center justify-end lg:flex'>
                        <div className='flex items-center gap-[54px] xl:pr-[144px] pr-[70px]'>
                            {AgencyNavigationLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className='text-sm font-normal text-white xl:text-base'
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>


                        {/* Buttons  */}
                        <div className='flex items-center'>
                            <Button
                                variant='transparent'
                                className='text-white'
                            >
                                Login
                            </Button>
                            <Button
                                variant='secondary'
                                className='w-max rounded-sm px-5'
                            >
                                Sign Up
                            </Button>
                        </div>
                    </nav>

                    {/* Mobile menu trigger */}
                    <button
                        type='button'
                        aria-label='Open menu'
                        aria-expanded={isMobileMenuOpen}
                        onClick={() => setIsMobileMenuOpen(true)}
                        className='group flex h-10 w-10 items-center justify-center rounded-md bg-white/10 backdrop-blur-sm transition hover:bg-white/20 lg:hidden'
                    >
                        <span className='flex flex-col items-end gap-[5px]'>
                            <span className='h-[2.5px] w-6 rounded-full bg-white transition-transform duration-300 group-hover:translate-x-[1px]' />
                            <span className='h-[2.5px] w-4 rounded-full bg-white transition-transform duration-300 group-hover:-translate-x-[1px]' />
                        </span>
                    </button>
                </div>
            </header>

            {/* Mobile drawer + overlay */}
            <div
                className={cn(
                    'fixed inset-0 z-[60] transition-opacity duration-300 lg:hidden',
                    isMobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
                )}
            >
                <button
                    type='button'
                    aria-label='Close menu overlay'
                    className='absolute inset-0 bg-black/45 backdrop-blur-[2px]'
                    onClick={() => setIsMobileMenuOpen(false)}
                />

                <aside
                    className={cn(
                        'absolute right-0 top-0 flex h-full w-[min(88vw,360px)] flex-col bg-primary-500 px-5 pb-6 pt-5 shadow-2xl transition-transform duration-300 sm:px-6',
                        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    )}
                >
                    <div className='flex items-center justify-between'>
                        <Image
                            src={'/images/generic/agency-logo.png'}
                            alt='logo'
                            width={100}
                            height={100}
                           className='h-auto w-[60px] sm:w-[70px] lg:w-[80px] xlw-[95px]'
                            quality={100}
                        />
                        <button
                            type='button'
                            aria-label='Close menu'
                            onClick={() => setIsMobileMenuOpen(false)}
                            className='flex h-9 w-9 items-center justify-center rounded-md bg-white/15 text-white transition hover:bg-white/25'
                        >
                            <span className='text-xl leading-none'>&times;</span>
                        </button>
                    </div>

                    <nav className='mt-10 flex flex-1 flex-col gap-2'>
                        {AgencyNavigationLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className='rounded-lg px-3 py-3 text-base font-medium text-white transition hover:bg-white/15'
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className='flex items-center gap-3 pt-4'>
                        <Button
                            variant='transparent'
                            className='flex-1 !w-full rounded-md border border-white/35 text-white hover:bg-white/10'
                        >
                            Login
                        </Button>
                        <Button
                            variant='secondary'
                            className='flex-1 !w-full rounded-md bg-white text-primary-700'
                        >
                            Sign Up
                        </Button>
                    </div>
                </aside>
            </div>
        </>
    )
}

export default Header