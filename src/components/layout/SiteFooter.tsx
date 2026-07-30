'use client'

import { FormEvent, useMemo, useState, type ComponentType, type SVGProps } from 'react'
import { toast } from 'sonner'
import FacebookIcon from '@/assets/svg/social/facebook'
import InstagramIcon from '@/assets/svg/social/instagram'
import LinkedinIcon from '@/assets/svg/social/linkedin'
import TwitterIcon from '@/assets/svg/social/twitter'
import { AgencyLink } from '@/components/links/AgencyLink'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import { getApiErrorMessage } from '@/lib/api/errors'
import { MessageCode } from '@/lib/messages/codes'
import { resolveThemeAssetUrl } from '@/lib/media/resolve-theme-asset'
import { isValidAgencyId } from '@/services/specialization/specialization.service'
import { useCreateSubscription } from '@/services/subscribe/subscribe.query'
import type { HomepagePage, NavItem } from '@/services/agency/agency.types'
import { cn } from '@/lib/utils/cn'

const FALLBACK_LINKS: NavItem[] = [
    { label: 'Packages', href: '/packages' },
    { label: 'Tours', href: '/tours' },
    { label: 'Services', href: '/services' },
]

const FALLBACK_SUPPORT: NavItem[] = [
    { label: 'About us', href: '/about-us' },
    { label: 'Contact', href: '/contact-us' },
    { label: 'Home', href: '/' },
]

function columnItems(
    column?: { items?: NavItem[]; links?: NavItem[] } | null
): NavItem[] {
    return column?.items ?? column?.links ?? []
}

function isExternalHref(href: string) {
    return (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:')
    )
}

function FooterLink({ item }: { item: NavItem }) {
    const href = item.href?.trim() || '#'
    const className =
        'block break-words text-sm leading-relaxed text-white/65 transition hover:text-white'

    if (isExternalHref(href)) {
        return (
            <a
                href={href}
                className={className}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
            >
                {item.label}
            </a>
        )
    }

    return (
        <AgencyLink href={href} className={className}>
            {item.label}
        </AgencyLink>
    )
}

type SocialIcon = ComponentType<SVGProps<SVGSVGElement>>

type SocialItem = {
    label: string
    href: string
    Icon: SocialIcon
}

export function SiteFooter({
    page,
    agencyId,
}: {
    page: HomepagePage
    agencyId?: string
}) {
    const variant = useTemplateVariant()
    const { footer, branding } = page
    const logoSrc =
        resolveThemeAssetUrl(footer.logo?.src) ||
        resolveThemeAssetUrl(branding.logo?.default?.src) ||
        resolveThemeAssetUrl(branding.logo?.onDark?.src)

    const [email, setEmail] = useState('')
    const { mutateAsync: subscribe, isPending } = useCreateSubscription()

    const columns = useMemo(() => {
        const cmsColumns = (footer.columns ?? [])
            .map((column) => ({
                title: column.title,
                items: columnItems(column).filter((item) => item.label?.trim()),
            }))
            .filter((column) => column.items.length > 0)

        return [
            {
                title: 'Links',
                items: FALLBACK_LINKS,
            },
            {
                title: 'Support',
                items: FALLBACK_SUPPORT,
            },
            ...cmsColumns,
        ]
    }, [footer.columns])

    const socialItems = useMemo(() => {
        const items: SocialItem[] = []
        if (footer.socialLinks?.instagram?.trim()) {
            items.push({
                label: 'Instagram',
                href: footer.socialLinks.instagram.trim(),
                Icon: InstagramIcon,
            })
        }
        if (footer.socialLinks?.facebook?.trim()) {
            items.push({
                label: 'Facebook',
                href: footer.socialLinks.facebook.trim(),
                Icon: FacebookIcon,
            })
        }
        if (footer.socialLinks?.twitter?.trim()) {
            items.push({
                label: 'Twitter',
                href: footer.socialLinks.twitter.trim(),
                Icon: TwitterIcon,
            })
        }
        if (footer.socialLinks?.linkedin?.trim()) {
            items.push({
                label: 'LinkedIn',
                href: footer.socialLinks.linkedin.trim(),
                Icon: LinkedinIcon,
            })
        }
        return items
    }, [footer.socialLinks])

    async function onSubscribe(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const value = email.trim().toLowerCase()
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            toast.error('Enter a valid email address.')
            return
        }
        if (!isValidAgencyId(agencyId)) {
            toast.error('Agency context is missing. Reload and try again.')
            return
        }

        try {
            await subscribe({
                agency_id: agencyId!,
                email: value,
                status: 'SUBSCRIBED',
            })
            toast.success('Subscribed successfully')
            setEmail('')
        } catch (error) {
            toast.error(
                getApiErrorMessage(error, MessageCode.API_NEWSLETTER_SUBSCRIBE_FAILED)
            )
        }
    }

    if (variant !== 'temp1' && variant !== 'temp2') return null

    const bg =
        footer.backgroundColor ||
        'var(--color-brand)'

    if (variant === 'temp1') {
        return (
            <footer className="text-white" style={{ backgroundColor: bg }}>
                <div className="site-container py-14">
                    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)] lg:gap-16">
                        <div className="space-y-4">
                            <AgencyLink
                                href="/"
                                aria-label={branding.name}
                                className="inline-flex"
                            >
                                {logoSrc ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={logoSrc}
                                        alt={footer.logo?.alt || branding.name}
                                        className="h-9 w-auto max-w-[200px] object-contain"
                                    />
                                ) : (
                                    <p className="text-xl font-semibold tracking-tight">
                                        {branding.name}
                                    </p>
                                )}
                            </AgencyLink>
                            <p className="max-w-sm text-sm leading-relaxed text-white/70">
                                {branding.tagline}. Discover national and international
                                tours with complete travel solutions.
                            </p>
                            {socialItems.length > 0 ? (
                                <div className="flex items-center gap-2.5 pt-1">
                                    {socialItems.map(({ label, href, Icon }) => (
                                        <a
                                            key={label}
                                            href={href}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label={label}
                                            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                                        >
                                            <Icon className="h-[18px] w-[18px]" />
                                        </a>
                                    ))}
                                </div>
                            ) : null}
                        </div>

                        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                            {columns.map((col) => (
                                <div
                                    key={col.title}
                                    className={cn(
                                        col.title.trim().toLowerCase() === 'contact'
                                            ? 'sm:col-span-2 lg:col-span-1'
                                            : undefined
                                    )}
                                >
                                    <p className="mb-4 text-sm font-semibold">
                                        {col.title}
                                    </p>
                                    <ul className="space-y-2.5">
                                        {col.items.map((item) => (
                                            <li key={`${col.title}-${item.label}`}>
                                                <FooterLink item={item} />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-12 border-t border-white/10 pt-10">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <p className="text-sm font-medium text-white/90">
                                Subscribe to our newsletter
                            </p>
                            <form
                                className="flex w-full max-w-sm overflow-hidden rounded-full bg-white/10 p-1"
                                onSubmit={onSubscribe}
                            >
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Your email"
                                    required
                                    className="min-w-0 flex-1 rounded-full bg-transparent px-4 py-2 text-sm text-white outline-none placeholder:text-white/50"
                                />
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#0B6E6A] disabled:opacity-60"
                                >
                                    {isPending ? 'Subscribing' : 'Subscribe'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10">
                    <p className="site-container py-5 text-xs text-white/50">
                        © {new Date().getFullYear()} {branding.name}. All rights
                        reserved.
                    </p>
                </div>
            </footer>
        )
    }

    return (
        <footer className="mt-20 text-white" style={{ backgroundColor: bg }}>
            <div className="site-container py-14 flex flex-wrap gap-10 justify-between">
                <div className="space-y-4">
                    <AgencyLink href="/" aria-label={branding.name} className="inline-flex">
                        {logoSrc ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={logoSrc}
                                alt={footer.logo?.alt || branding.name}
                                className="h-9 w-auto max-w-[200px] object-contain"
                            />
                        ) : (
                            <p className="text-xl font-semibold tracking-tight">
                                {branding.name}
                            </p>
                        )}
                    </AgencyLink>
                    <p className="max-w-sm text-sm leading-relaxed text-white/70">
                        {branding.tagline}. Discover national and international tours with
                        complete travel solutions.
                    </p>
                    <form
                        className="flex w-full max-w-sm overflow-hidden rounded-full bg-white/10 p-1"
                        onSubmit={onSubscribe}
                    >
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your email"
                            required
                            className="min-w-0 flex-1 bg-transparent px-4 py-2 rounded-full mr-1 text-sm text-white outline-none placeholder:text-white/50"
                        />
                        <button
                            type="submit"
                            disabled={isPending}
                            className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#06403D] disabled:opacity-60"
                        >
                            {isPending ? "Subscribing" : 'Subscribe'}
                        </button>
                    </form>
                    {socialItems.length > 0 ? (
                        <div className="flex items-center gap-2.5 pt-1">
                            {socialItems.map(({ label, href, Icon }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={label}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                                >
                                    <Icon className="h-[18px] w-[18px]" />
                                </a>
                            ))}
                        </div>
                    ) : null}
                </div>

                <div className="flex flex-wrap md:gap-24 gap-16 justify-between pr-10">
                    {columns.map((col) => (
                        <div
                            key={col.title}
                            className={cn(
                                "max-w-[260px]",
                                col.title.trim().toLowerCase() === 'contact'
                                    ? 'col-span-2 sm:col-span-1'
                                    : undefined
                            )}
                        >
                            <p className="mb-4 text-sm font-semibold">{col.title}</p>
                            <ul className="space-y-2.5">
                                {col.items.map((item) => (
                                    <li key={`${col.title}-${item.label}`}>
                                        <FooterLink item={item} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-white/10">
                <p className="site-container py-5 text-xs text-white/50">
                    © {new Date().getFullYear()} {branding.name}. All rights reserved.
                </p>
            </div>
        </footer>
    )
}
