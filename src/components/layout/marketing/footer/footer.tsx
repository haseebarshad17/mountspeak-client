'use client'

import Link from 'next/link'
import React, { FormEvent, useState } from 'react'
import { toast } from 'sonner'

import { SocialIconLinks } from '@/components/layout/marketing/SocialIconLink'
import { Button } from '@/components/ui/button'
import { HomepageMediaImage } from '@/components/ui/homepage-media-image'
import type { HomepagePage } from '@/data/homepage'
import { STATIC_UI_COLORS } from '@/data/homepage'
import { useInternalPathname, usePrefixedHref } from '@/hooks/useAgencyPreviewBase'
import { getBrandingLogo } from '@/lib/homepage/branding-logo'
import { getActiveFooterSocialLinks } from '@/lib/homepage/footer-social'
import { getFooterDisplayColumns } from '@/lib/homepage/normalize-homepage'
import { cn } from '@/lib/utils/clsxUtils'
import { selectHomepageThemeUpdatedAt } from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'

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

function FooterNewsletter() {
    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const trimmed = email.trim()
        if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
            toast.error('Please enter a valid email address.')
            return
        }

        setIsSubmitting(true)
        window.setTimeout(() => {
            toast.success('Thanks for subscribing to our newsletter.')
            setEmail('')
            setIsSubmitting(false)
        }, 400)
    }

    return (
        <div className='w-full max-w-md'>
            <h3 className='text-base font-semibold text-white sm:text-lg'>Newsletter</h3>
            <p className='mt-2 text-sm leading-relaxed text-white/80 sm:text-[15px]'>
                Get travel tips, new packages, and exclusive offers in your inbox.
            </p>

            <form
                onSubmit={handleSubmit}
                className='mt-4 flex w-full items-center gap-2 sm:mt-5 sm:gap-2.5'
                noValidate
            >
                <label className='sr-only' htmlFor='footer-newsletter-email'>
                    Email address
                </label>
                <input
                    id='footer-newsletter-email'
                    type='email'
                    name='email'
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder='Enter your email'
                    autoComplete='email'
                    required
                    className={cn(
                        'h-11 w-full min-w-0 flex-1 rounded-full border border-white/25 bg-transparent px-4',
                        'text-sm text-white placeholder:text-white/55 outline-none',
                        'transition-[border-color,background-color,box-shadow] duration-200',
                        'hover:border-white/40',
                        'focus:border-white/50 focus:bg-white/5 focus:ring-2 focus:ring-white/15',
                    )}
                />
                <Button
                    type='submit'
                    variant='default'
                    size='sm'
                    loading={isSubmitting}
                    loadingText='...'
                    className={cn(
                        'h-11 shrink-0 rounded-full border-0 px-5 !normal-case !tracking-normal',
                        'bg-white text-[var(--hp-color-primary)] hover:bg-white/90',
                        'focus-visible:bg-white/90',
                    )}
                >
                    Subscribe
                </Button>
            </form>
        </div>
    )
}

const Footer = ({ page }: FooterProps) => {
    const { footer, branding, sections, seo } = page
    const themeUpdatedAt = useAppSelector(selectHomepageThemeUpdatedAt)
    const columns = getFooterDisplayColumns()
    const socialLinks = getActiveFooterSocialLinks(footer.socialLinks)
    const description = sections.hero.paragraph
    const siteName = branding.name || seo.siteName
    const footerLogo = getBrandingLogo(branding, 'onDark', themeUpdatedAt)
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
                                        key={footerLogo.src}
                                        src={footerLogo.src}
                                        alt={footerLogo.alt}
                                        width={212}
                                        height={88}
                                        priority
                                        fetchPriority='high'
                                        quality={100}
                                        unoptimized
                                        className='max-h-[88px] w-auto max-w-[212px]'
                                    />
                                </Link>

                                {description ? (
                                    <p className='max-w-md text-sm leading-relaxed text-white sm:text-[15px] sm:leading-7'>
                                        {description}
                                    </p>
                                ) : null}

                                <SocialIconLinks links={socialLinks} className='gap-3' />
                            </div>

                            <div className='grid grid-cols-2 gap-8 sm:gap-10 lg:justify-items-end lg:gap-12 xl:gap-16'>
                                {columns.map((column) => (
                                    <FooterNavColumn key={column.title} column={column} />
                                ))}
                            </div>
                        </div>

                        <div className='mt-10 border-t border-white/10 pt-8 sm:mt-12 sm:pt-10 lg:mt-14'>
                            <FooterNewsletter />
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
