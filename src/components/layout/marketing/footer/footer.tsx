'use client'

import Link from 'next/link'
import React from 'react'

import { SocialIconLinks } from '@/components/layout/marketing/SocialIconLink'
import { HomepageMediaImage } from '@/components/ui/homepage-media-image'
import type { HomepagePage } from '@/data/homepage'
import { STATIC_UI_COLORS } from '@/data/homepage'
import { useInternalPathname, usePrefixedHref } from '@/hooks/useAgencyPreviewBase'
import { getActiveFooterSocialLinks } from '@/lib/homepage/footer-social'
import { getFooterDisplayColumns } from '@/lib/homepage/normalize-homepage'
import { cn } from '@/lib/utils/clsxUtils'

type FooterProps = {
    page: HomepagePage
}

type FooterColumn = ReturnType<typeof getFooterDisplayColumns>[number]

const FOOTER_PATTERN_STYLE: React.CSSProperties = {
    backgroundImage: [
        'linear-gradient(125deg, transparent 42%, rgba(255,255,255,0.07) 42%, rgba(255,255,255,0.07) 43%, transparent 43%)',
        'linear-gradient(55deg, transparent 58%, rgba(255,255,255,0.05) 58%, rgba(255,255,255,0.05) 59%, transparent 59%)',
        'linear-gradient(165deg, transparent 72%, rgba(255,255,255,0.04) 72%, rgba(255,255,255,0.04) 73%, transparent 73%)',
    ].join(', '),
    backgroundSize: '100% 100%',
}

function isFooterLinkActive(pathname: string, href: string | null | undefined): boolean {
    if (!href) return false
    if (href === '/') return pathname === '/'
    const [path] = href.split('#')
    if (!path) return false
    return pathname === path || pathname.startsWith(`${path}/`)
}

function FooterLink({
    href,
    label,
    className,
}: {
    href: string
    label: string
    className?: string
}) {
    const pathname = useInternalPathname()
    const resolvedHref = usePrefixedHref(href) ?? href
    const isActive = isFooterLinkActive(pathname, href)

    return (
        <Link
            href={resolvedHref}
            className={cn(
                'text-sm leading-relaxed text-white/90 transition-colors hover:text-white sm:text-[15px]',
                isActive && 'font-medium underline underline-offset-4',
                className,
            )}
        >
            {label}
        </Link>
    )
}

function FooterNavColumn({ column }: { column: FooterColumn }) {
    const entries = 'links' in column && column.links ? column.links : (column.items ?? [])

    return (
        <div className='min-w-[120px]'>
            <h3 className='mb-4 text-base font-semibold text-white sm:mb-5 sm:text-lg'>{column.title}</h3>
            <ul className='space-y-2.5 sm:space-y-3'>
                {entries.map((entry, index) => (
                    <li key={`${entry.label}-${index}`}>
                        <FooterLink href={entry.href ?? '/'} label={entry.label} />
                    </li>
                ))}
            </ul>
        </div>
    )
}

const Footer = ({ page }: FooterProps) => {
    const { footer, branding, sections, seo } = page
    const columns = getFooterDisplayColumns()
    const socialLinks = getActiveFooterSocialLinks(footer.socialLinks)
    const description = sections.hero.paragraph
    const siteName = branding.name || seo.siteName
    const year = new Date().getFullYear()

    return (
        <footer id='marketing-footer' className='bg-[#E8F3F2] px-3 py-10 sm:px-4 sm:py-12 md:py-14'>
            <div className='agency-container'>
                <div
                    className='relative overflow-hidden rounded-[24px] sm:rounded-[28px] md:rounded-[32px]'
                    style={{ backgroundColor: footer.backgroundColor }}
                >
                    <div
                        aria-hidden
                        className='pointer-events-none absolute inset-0'
                        style={FOOTER_PATTERN_STYLE}
                    />

                    <div className='relative px-6 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14'>
                        <div className='grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start lg:gap-12 xl:gap-16'>
                            <div className='flex flex-col items-start gap-5 sm:gap-6'>
                                <Link href='/' className='shrink-0 inline-block'>
                                    <HomepageMediaImage
                                        src={footer.logo.src}
                                        alt={branding.logo.default.alt}
                                        width={212}
                                        height={88}
                                        priority
                                        fetchPriority='high'
                                        quality={100}
                                        className='max-w-[212px] max-h-[88px] w-auto'
                                    />
                                </Link>

                                {description ? (
                                    <p className='max-w-md text-sm leading-relaxed text-white sm:text-[15px] sm:leading-7'>
                                        {description}
                                    </p>
                                ) : null}

                                <SocialIconLinks links={socialLinks} className="gap-3" />
                            </div>

                            <div className='grid grid-cols-2 gap-8 sm:gap-10 lg:justify-items-end lg:gap-12 xl:gap-16'>
                                {columns.map((column) => (
                                    <FooterNavColumn key={column.title} column={column} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className='relative border-t border-white/10 px-6 py-4 text-center sm:px-8'>
                        <p className='text-xs text-white/80 sm:text-sm'>
                            Copyright &copy; {year}, {siteName}, All Rights Reserved.
                        </p>
                    </div>

                    <div
                        aria-hidden
                        className='h-1.5 w-full sm:h-2'
                        style={{ backgroundColor: STATIC_UI_COLORS.accent }}
                    />
                </div>
            </div>
        </footer>
    )
}

export default Footer
