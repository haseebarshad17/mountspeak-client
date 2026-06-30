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

const footerColumnTitleClassName =
    'pb-3 text-base font-semibold tracking-tight text-white sm:pb-3.5 sm:text-lg'

const footerItemTextClassName =
    'text-sm font-normal leading-relaxed text-white/85 transition-colors hover:text-white sm:text-base'

const footerLinkClassName = cn(footerItemTextClassName, 'hover:underline underline-offset-4')

const footerBlockClassName =
    'flex w-full max-w-[1100px] flex-col items-center text-center text-white'

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
            className='h-1.5 w-1.5 shrink-0 rounded-full bg-white/70 sm:h-[7px] sm:w-[7px]'
        />
    )
}

function FooterLinksBlock({ column }: { column: FooterColumn }) {
    const entries = 'links' in column && column.links ? column.links : (column.items ?? [])

    return (
        <div className={footerBlockClassName}>
            <h3 className={footerColumnTitleClassName}>{column.title}</h3>
            <ul className='flex flex-row flex-wrap items-center justify-center gap-x-4 gap-y-2.5 sm:gap-x-5 sm:gap-y-3'>
                {entries.map((entry, linkIdx) => {
                    const item = (
                        <li key={`item-${linkIdx}`}>
                            <FooterLink
                                href={entry.href ?? '/'}
                                className={footerLinkClassName}
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
        <div className={footerBlockClassName}>
            <h3 className={footerColumnTitleClassName}>{title}</h3>
            <ul className='flex flex-row flex-wrap items-center justify-center gap-x-4 gap-y-3 sm:gap-x-5 sm:gap-y-3.5'>
                {contactItems.map((item, index) => {
                    const Icon = contactItemIcons[item.kind]
                    const content = item.href ? (
                        <a
                            href={item.href}
                            className={footerLinkClassName}
                        >
                            {item.label}
                        </a>
                    ) : (
                        <span className={footerItemTextClassName}>{item.label}</span>
                    )

                    const rowItem = (
                        <li
                            key={`${item.label}-${index}`}
                            className='inline-flex max-w-full items-center gap-2.5'
                        >
                            <Icon className='h-[18px] w-[18px] shrink-0 text-white/90 sm:h-5 sm:w-5' aria-hidden />
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
        <footer id="marketing-footer" style={{ backgroundColor: footer.backgroundColor }}>
            <div className='agency-container'>
                <section className='flex flex-col items-center gap-7 py-10 text-center sm:gap-9 sm:py-12 lg:gap-11 lg:py-14'>
                    <Link href={homeHref} className='inline-block'>
                        <HomepageMediaImage
                            src={footer.logo.src}
                            alt={footer.logo.alt}
                            width={180}
                            height={120}
                            className='mx-auto h-auto max-h-[100px] w-[130px] object-contain sm:w-[150px] lg:w-[180px]'
                        />
                    </Link>

                    <div className='flex w-full flex-col items-center gap-7 sm:gap-9'>
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
