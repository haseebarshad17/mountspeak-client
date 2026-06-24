'use client'

import { cn } from '@/lib/utils/clsxUtils'
import type { HomepagePage } from '@/data/homepage'
import { getFooterContactColumnItems } from '@/lib/homepage/footer-contact'
import { getFooterDisplayColumns } from '@/lib/homepage/normalize-homepage'
import { usePrefixedHref } from '@/hooks/useAgencyPreviewBase'
import { HomepageMediaImage } from '@/components/ui/homepage-media-image'
import { Mail, MapPin, Phone, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type FooterProps = {
    footer: HomepagePage['footer']
}

type FooterColumn = ReturnType<typeof getFooterDisplayColumns>[number]

const contactItemIcons: Record<'email' | 'phone' | 'location' | 'other', LucideIcon> = {
    email: Mail,
    phone: Phone,
    location: MapPin,
    other: MapPin,
}

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

function FooterLinksBlock({ column }: { column: FooterColumn }) {
    const entries = 'links' in column && column.links ? column.links : (column.items ?? [])

    return (
        <div className='flex w-full max-w-[1100px] flex-col items-center text-center text-white'>
            <h3 className='pb-2 text-sm font-semibold sm:text-base'>{column.title}</h3>
            <ul className='flex flex-row flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-x-4'>
                {entries.map((entry, linkIdx) => {
                    const item = (
                        <li key={`item-${linkIdx}`}>
                            <FooterLink
                                href={entry.href ?? '/'}
                                className={cn(
                                    'text-xs font-normal opacity-80 sm:text-sm',
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

function FooterContactBlock({ footer, title }: { footer: HomepagePage['footer']; title: string }) {
    const contactItems = getFooterContactColumnItems(footer)

    if (contactItems.length === 0) return null

    return (
        <div className='flex w-full max-w-[1100px] flex-col items-center text-center text-white'>
            <h3 className='pb-2 text-sm font-semibold sm:text-base'>{title}</h3>
            <ul className='flex flex-row flex-wrap items-center justify-center gap-x-3 gap-y-3 sm:gap-x-4 sm:gap-y-3'>
                {contactItems.map((item, index) => {
                    const Icon = contactItemIcons[item.kind]
                    const content = item.href ? (
                        <a
                            href={item.href}
                            className='text-xs font-normal opacity-80 transition hover:opacity-100 hover:underline sm:text-sm'
                        >
                            {item.label}
                        </a>
                    ) : (
                        <span className='text-xs font-normal opacity-80 sm:text-sm'>{item.label}</span>
                    )

                    const rowItem = (
                        <li
                            key={`${item.label}-${index}`}
                            className='inline-flex max-w-full items-center gap-2'
                        >
                            <Icon className='h-4 w-4 shrink-0 text-white opacity-90' aria-hidden />
                            {content}
                        </li>
                    )

                    if (index === 0) return rowItem

                    return (
                        <React.Fragment key={index}>
                            <FooterDot />
                            {rowItem}
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
                <section className='flex flex-col items-center gap-6 py-8 text-center sm:gap-8 sm:py-10 lg:gap-10 lg:py-12'>
                    <Link href={homeHref} className='inline-block'>
                        <HomepageMediaImage
                            src={footer.logo.src}
                            alt={footer.logo.alt}
                            width={180}
                            height={120}
                            className='mx-auto h-auto max-h-[100px] w-[130px] object-contain sm:w-[150px] lg:w-[180px]'
                        />
                    </Link>

                    <div className='flex w-full flex-col items-center gap-6 sm:gap-8'>
                        {linksColumn ? <FooterLinksBlock column={linksColumn} /> : null}
                        {contactColumn ? (
                            <FooterContactBlock footer={footer} title={contactColumn.title} />
                        ) : null}
                    </div>
                </section>
            </div>
        </footer>
    )
}

export default Footer
