"use client"

import { Menu, User, X } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

import { clientHeaderContent } from './content'

const ClientHeader = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <nav className='sticky top-0 z-50 border-b bg-white'>
            <div className='container'>
                <div className='flex h-16 items-center justify-between'>
                    <Link href='/client' className='flex items-center gap-2'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-[rgb(var(--color-primary-400))] to-[rgb(var(--color-primary-600))]'>
                            <span className='text-sm font-bold text-white'>T</span>
                        </div>
                        <span className='text-xl font-medium text-neutral-900'>{clientHeaderContent.brand}</span>
                    </Link>

                    <div className='hidden items-center gap-8 md:flex'>
                        {clientHeaderContent.navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className='text-neutral-700 transition-colors hover:text-[rgb(var(--color-primary-600))]'
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className='flex items-center gap-3'>
                        <Link
                            href={clientHeaderContent.portalHref}
                            className='hidden items-center gap-2 rounded-md px-4 py-2 text-neutral-700 transition-colors hover:bg-neutral-100 md:flex'
                        >
                            <User className='h-5 w-5' />
                            {clientHeaderContent.portalLabel}
                        </Link>
                        <button
                            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                            className='rounded-md p-2 transition-colors hover:bg-neutral-100 md:hidden'
                            aria-label='Toggle menu'
                        >
                            {isMobileMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
                        </button>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className='border-t py-4 md:hidden'>
                        <div className='flex flex-col gap-3'>
                            {clientHeaderContent.navItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className='rounded-md px-4 py-2 text-neutral-700 transition-colors hover:bg-neutral-100'
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <Link
                                href={clientHeaderContent.portalHref}
                                className='rounded-md px-4 py-2 text-neutral-700 transition-colors hover:bg-neutral-100'
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {clientHeaderContent.portalLabel}
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default ClientHeader
