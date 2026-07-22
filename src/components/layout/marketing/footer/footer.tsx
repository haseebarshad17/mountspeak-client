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
import { useResolvedAgencyId } from '@/hooks/useResolvedAgencyId'
import { getApiErrorMessage } from '@/lib/api/errors'
import { getBrandingLogo } from '@/lib/homepage/branding-logo'
import { getActiveFooterSocialLinks } from '@/lib/homepage/footer-social'
import { getFooterDisplayColumns } from '@/lib/homepage/normalize-homepage'
import { MessageCode } from '@/lib/messages/codes'
import { getMessage } from '@/lib/messages/get-message'
import { cn } from '@/lib/utils/clsxUtils'
import { useSubscribeNewsletter } from '@/services/newsletter/newsletter.queries'
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

function isExternalOrProtocolHref(href: string): boolean {
    return /^(https?:|mailto:|tel:|sms:)/i.test(href) || href.startsWith('//')
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
    const isExternal = isExternalOrProtocolHref(href)
    const isActive = !isExternal && isFooterLinkActive(pathname, href)
    const linkClassName = cn(
        'text-sm leading-6 text-white/85 transition-colors hover:text-white',
        isActive && 'font-medium text-white underline underline-offset-4',
        className,
    )

    if (isExternal) {
        return (
            <a href={href} className={linkClassName}>
                {label}
            </a>
        )
    }

    return (
        <Link href={resolvedHref} className={linkClassName}>
            {label}
        </Link>
    )
}

function FooterNavColumn({ column }: { column: FooterColumn }) {
    const entries = column.links?.length ? column.links : (column.items ?? [])

    return (
        <div className='min-w-0'>
            <h3 className='mb-3 text-sm font-semibold text-white xs:mb-3.5 xs:text-base'>{column.title}</h3>
            <ul className='space-y-2'>
                {entries.map((entry, index) => {
                    const href = entry.href?.trim() || null

                    return (
                        <li key={`${entry.label}-${index}`}>
                            {href ? (
                                <FooterLink href={href} label={entry.label} />
                            ) : (
                                <span className='block text-sm leading-6 text-white/85'>{entry.label}</span>
                            )}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

function FooterNewsletter() {
    const [email, setEmail] = useState('')
    const { resolvedAgencyId, isAgencySite, isReady } = useResolvedAgencyId()
    const { mutate: subscribeToNewsletter, isPending: isSubmitting } = useSubscribeNewsletter()

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!isReady) {
            return
        }

        if (isAgencySite && !resolvedAgencyId) {
            toast.error(getMessage(MessageCode.BOOKING_MISSING_AGENCY))
            return
        }

        const trimmed = email.trim()
        if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
            toast.error('Please enter a valid email address.')
            return
        }

        subscribeToNewsletter(
            {
                email: trimmed,
                ...(resolvedAgencyId ? { agency_id: resolvedAgencyId } : {}),
            },
            {
                onSuccess: (data) => {
                    setEmail('')
                    if (data.already_subscribed) {
                        toast.info(data.message)
                    } else {
                        toast.success(data.message)
                    }
                },
                onError: (error) => {
                    toast.error(
                        error.message ||
                        getApiErrorMessage(error, MessageCode.API_NEWSLETTER_SUBSCRIBE_FAILED),
                    )
                },
            },
        )
    }

    return (
        <div className='w-full max-w-lg'>
            <h3 className='text-sm font-semibold text-white xs:text-base'>Newsletter</h3>
            <p className='mt-1.5 max-w-sm text-sm leading-6 text-white/75'>
                Get travel tips, new packages, and exclusive offers in your inbox.
            </p>

            <form
                onSubmit={handleSubmit}
                className='mt-3.5 flex w-full max-w-sm items-center gap-2 xs:mt-4'
                noValidate
            >
                <label className='sr-only' htmlFor='footer-newsletter-email'>
                    Email address
                </label>
                <input
                    required
                    id='footer-newsletter-email'
                    type='email'
                    name='email'
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder='Enter your email'
                    autoComplete='email'
                    className={cn(
                        'h-10 w-full min-w-0 flex-1 rounded-full border border-white/25 bg-transparent px-3.5',
                        'text-sm text-white placeholder:text-white/50 outline-none',
                        'transition-[border-color,background-color,box-shadow] duration-200',
                        'hover:border-white/40',
                        'focus:border-white/50 focus:bg-white/5 focus:ring-2 focus:ring-white/15',
                        'xs:h-11 xs:px-4',
                    )}
                />
                <Button
                    type='submit'
                    variant='secondary'
                    size='sm'
                    loading={isSubmitting}
                    loadingText='...'
                    className={cn(
                        'h-10 shrink-0 rounded-full border-0 bg-white px-4 text-black',
                        '!normal-case !tracking-normal hover:bg-white/90 focus-visible:bg-white/90',
                        'xs:h-11 xs:px-5 font-medium',
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
    const columns = getFooterDisplayColumns(footer)
    const socialLinks = getActiveFooterSocialLinks(footer.socialLinks)
    const description = sections.hero.paragraph
    const siteName = branding.name || seo.siteName
    const footerLogo = getBrandingLogo(branding, 'onDark', themeUpdatedAt)
    const year = new Date().getFullYear()

    return (
        <footer id='marketing-footer' className='bg-[#E8F3F2] px-3 py-8 xs:px-4 xs:py-10 sm:py-12 md:py-14'>
            <div className='agency-container'>
                <div
                    className='relative overflow-hidden rounded-2xl xs:rounded-[24px] sm:rounded-[28px] md:rounded-[32px]'
                    style={{ backgroundColor: footer.backgroundColor }}
                >
                    <div
                        aria-hidden
                        className='pointer-events-none absolute inset-0'
                        style={FOOTER_PATTERN_STYLE}
                    />

                    <div className='relative px-5 py-8 xs:px-6 xs:py-9 sm:px-8 sm:py-10 md:px-10 lg:px-12 lg:py-12'>
                        <div
                            className={cn(
                                'grid gap-8 xs:gap-9 sm:gap-10 xl:gap-14',
                                'lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-start lg:gap-10',
                            )}
                        >
                            <div className='flex min-w-0 flex-col items-start gap-4 xs:gap-5 sm:gap-5'>
                                <Link href='/' className='inline-block shrink-0'>
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
                                        className='max-h-16 w-auto max-w-[180px] xs:max-h-[72px] xs:max-w-[196px] sm:max-h-[88px] sm:max-w-[212px]'
                                    />
                                </Link>

                                {description ? (
                                    <p className='max-w-md text-sm leading-6 text-white/90 sm:leading-7'>
                                        {description}
                                    </p>
                                ) : null}

                                <SocialIconLinks links={socialLinks} className='gap-2.5 xs:gap-3' />
                            </div>

                            <div
                                className={cn(
                                    'grid min-w-0 grid-cols-2 gap-x-6 gap-y-6',
                                    columns.length >= 3
                                        ? 'sm:grid-cols-3 md:max-w-none lg:ml-0 lg:justify-self-start lg:gap-x-12 xl:gap-x-16'
                                        : 'md:max-w-md lg:ml-0 lg:max-w-none lg:justify-self-start lg:gap-x-20',
                                )}
                            >
                                {columns.map((column) => (
                                    <FooterNavColumn key={column.title} column={column} />
                                ))}
                            </div>
                        </div>

                        <div className='mt-8 border-t border-white/10 pt-6 xs:mt-9 xs:pt-7 sm:mt-10 sm:pt-8 lg:mt-11 lg:pt-9'>
                            <FooterNewsletter />
                        </div>
                    </div>

                    <div className='relative border-t border-white/10 px-5 py-3.5 text-center xs:px-6 xs:py-4 sm:px-8'>
                        <p className='text-xs leading-5 text-white/75 sm:text-sm'>
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
