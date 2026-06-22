'use client'

import { cn } from '@/lib/utils/clsxUtils'
import type { HomepagePage } from '@/data/homepage'
import { getFooterDisplayColumns } from '@/lib/homepage/normalize-homepage'
import { usePrefixedHref } from '@/hooks/useAgencyPreviewBase'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type FooterProps = {
    footer: HomepagePage['footer']
}

type FooterColumn = ReturnType<typeof getFooterDisplayColumns>[number]

function FooterLink({
    href,
    className,
    children,
}: {
    href: string
    className: string
    children: React.ReactNode
}) {
    const resolvedHref = usePrefixedHref(href) ?? href

    return (
        <Link href={resolvedHref} className={className}>
            {children}
        </Link>
    )
}

function FooterDot() {
    return (
        <li
            aria-hidden
            className='h-1.5 w-1.5 shrink-0 rounded-full bg-white opacity-80'
        />
    )
}

function FooterColumnBlock({ column }: { column: FooterColumn }) {
    const entries = 'links' in column && column.links ? column.links : (column.items ?? [])

    return (
        <div className='flex w-full max-w-[1100px] flex-col items-center text-center text-white'>
            <h3 className='pb-3 text-sm font-semibold sm:pb-4 sm:text-lg'>{column.title}</h3>
            <ul className='flex flex-row flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-x-4 sm:gap-y-3'>
                {entries.map((entry, linkIdx) => {
                    const item = !entry.href ? (
                        <li
                            key={`item-${linkIdx}`}
                            className='text-xs font-normal opacity-80 sm:text-base'
                        >
                            {entry.label}
                        </li>
                    ) : (
                        <li key={`item-${linkIdx}`}>
                            <FooterLink
                                href={entry.href}
                                className={cn(
                                    'text-xs font-normal opacity-80 sm:text-base',
                                    'hover:opacity-100',
                                )}
                            >
                                {entry.label}
                            </FooterLink>
                        </li>
                    )

                    if (linkIdx === 0) return item

                    return (
                        <React.Fragment key={linkIdx}>
                            <FooterDot />
                            {item}
                        </React.Fragment>
                    )
                })}
            </ul>
        </div>
    )
}

const Footer = ({ footer }: FooterProps) => {
    const homeHref = usePrefixedHref('/') ?? '/'
    const columns = getFooterDisplayColumns(footer)
    const linksColumn = columns.find((column) => column.title.toLowerCase() === 'links')
    const contactColumn = columns.find((column) => column.title.toLowerCase().includes('contact'))

    return (
        <footer style={{ backgroundColor: footer.backgroundColor }}>
            <div className='agency-container'>
                <section className='flex flex-col items-center gap-10 py-12 text-center sm:gap-12 sm:py-16 lg:gap-14 lg:py-[95px]'>
                    <Link href={homeHref} className='inline-block'>
                        <Image
                            src={footer.logo.src}
                            alt={footer.logo.alt}
                            width={180}
                            height={120}
                            className='mx-auto h-auto w-[130px] sm:w-[150px] lg:w-[180px] max-h-[100px]'
                        />
                    </Link>

                    <div className='flex w-full flex-col items-center gap-10 sm:gap-12'>
                        {linksColumn ? <FooterColumnBlock column={linksColumn} /> : null}
                        {contactColumn ? <FooterColumnBlock column={contactColumn} /> : null}
                    </div>
                </section>
            </div>
        </footer>
    )
}

export default Footer
