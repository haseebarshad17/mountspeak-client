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
import type { AgencySpecializationCapabilities } from '@/services/specialization/specialization.types'
import { cn } from '@/lib/utils/cn'

const FALLBACK_LEGAL: NavItem[] = [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
]

function columnItems(
    column?: { items?: NavItem[]; links?: NavItem[] } | null
): NavItem[] {
    return column?.items ?? column?.links ?? []
}

function columnKey(title: string) {
    return title.trim().toLowerCase()
}

function isSiteMapColumn(title: string) {
    const key = columnKey(title)
    return key === 'site map' || key === 'sitemap' || key === 'links'
}

function isLegalColumn(title: string) {
    return columnKey(title) === 'legal'
}

function isContactColumn(title: string) {
    return columnKey(title) === 'contact'
}

/** Same specialization gates as the header nav. */
function specializationSiteMap(
    capabilities?: AgencySpecializationCapabilities
): NavItem[] {
    const items: NavItem[] = [{ label: 'Home', href: '/' }]

    if (!capabilities || capabilities.hasTours) {
        items.push({ label: 'Tours', href: '/tours' })
    }
    if (!capabilities || capabilities.hasPackages) {
        items.push({ label: 'Packages', href: '/packages' })
    }
    if (!capabilities || capabilities.hasInternational) {
        items.push({ label: 'International', href: '/international' })
    }

    items.push(
        { label: 'Services', href: '/services' },
        { label: 'About Us', href: '/about-us' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Contact', href: '/contact-us' }
    )

    return items
}

function filterBySpecialization(
    items: NavItem[],
    capabilities?: AgencySpecializationCapabilities
): NavItem[] {
    return items.filter((item) => {
        const href = item.href?.trim() || ''
        const label = item.label?.trim().toLowerCase() || ''

        // No /discover route on this site.
        if (href === '/discover' || label === 'discover') return false

        if (href === '/packages' || label === 'packages') {
            return !capabilities || capabilities.hasPackages
        }
        if (href === '/tours' || label === 'tours') {
            return !capabilities || capabilities.hasTours
        }
        if (href === '/international' || label === 'international') {
            return !capabilities || capabilities.hasInternational
        }
        return true
    })
}

function ensureLink(
    items: NavItem[],
    link: NavItem,
    afterLabel?: string
): NavItem[] {
    const exists = items.some(
        (item) =>
            item.href?.trim() === link.href ||
            item.label?.trim().toLowerCase() === link.label.trim().toLowerCase()
    )
    if (exists) return items

    if (afterLabel) {
        const index = items.findIndex(
            (item) =>
                item.label?.trim().toLowerCase() === afterLabel.toLowerCase()
        )
        if (index >= 0) {
            return [
                ...items.slice(0, index + 1),
                link,
                ...items.slice(index + 1),
            ]
        }
    }

    return [...items, link]
}

function buildFooterColumns(
    footerColumns: HomepagePage['footer']['columns'] | undefined,
    capabilities?: AgencySpecializationCapabilities
) {
    const cmsColumns = (footerColumns ?? [])
        .map((column) => ({
            title: column.title,
            items: filterBySpecialization(
                columnItems(column).filter((item) => item.label?.trim()),
                capabilities
            ),
        }))
        .filter((column) => column.items.length > 0)

    const siteMapFromCms = cmsColumns.find((column) =>
        isSiteMapColumn(column.title)
    )
    const legalFromCms = cmsColumns.find((column) => isLegalColumn(column.title))
    const contactFromCms = cmsColumns.find((column) =>
        isContactColumn(column.title)
    )
    const otherCms = cmsColumns.filter(
        (column) =>
            !isSiteMapColumn(column.title) &&
            !isLegalColumn(column.title) &&
            !isContactColumn(column.title)
    )

    let siteMapItems = siteMapFromCms?.items?.length
        ? [...siteMapFromCms.items]
        : specializationSiteMap(capabilities)

    siteMapItems = ensureLink(
        siteMapItems,
        { label: 'Services', href: '/services' },
        'Tours'
    )
    siteMapItems = ensureLink(siteMapItems, { label: 'FAQ', href: '/faq' }, 'About Us')
    siteMapItems = filterBySpecialization(siteMapItems, capabilities)

    const legalItems = legalFromCms?.items?.length
        ? ensureLink(
              ensureLink(legalFromCms.items, {
                  label: 'Privacy Policy',
                  href: '/privacy-policy',
              }),
              { label: 'Terms of Service', href: '/terms-of-service' }
          )
        : FALLBACK_LEGAL

    const columns: Array<{ title: string; items: NavItem[] }> = [
        {
            title: siteMapFromCms?.title || 'Site Map',
            items: siteMapItems,
        },
    ]

    if (contactFromCms) columns.push(contactFromCms)
    columns.push(...otherCms)

    return { columns, legalItems }
}

function isExternalHref(href: string) {
    return (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:')
    )
}

function FooterLink({
    item,
    className = 'block break-words text-sm leading-relaxed text-white/65 transition hover:text-white',
}: {
    item: NavItem
    className?: string
}) {
    const href = item.href?.trim() || '#'

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

function FooterLegalLinks({
    items,
    linkClassName,
}: {
    items: NavItem[]
    linkClassName: string
}) {
    if (items.length === 0) return null

    return (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            {items.map((item) => (
                <FooterLink key={item.label} item={item} className={linkClassName} />
            ))}
        </div>
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
    capabilities,
}: {
    page: HomepagePage
    agencyId?: string
    capabilities?: AgencySpecializationCapabilities
}) {
    const variant = useTemplateVariant()
    const { footer, branding } = page
    const logoSrc =
        resolveThemeAssetUrl(branding.logo?.onDark?.src) ||
        resolveThemeAssetUrl(footer.logo?.src) ||
        resolveThemeAssetUrl(branding.logo?.default?.src)

    const [email, setEmail] = useState('')
    const { mutateAsync: subscribe, isPending } = useCreateSubscription()

    const { columns, legalItems } = useMemo(
        () => buildFooterColumns(footer.columns, capabilities),
        [footer.columns, capabilities]
    )

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

    if (variant !== 'temp1' && variant !== 'temp2' && variant !== 'temp3')
        return null

    const bg =
        footer.backgroundColor ||
        'var(--color-brand)'

    if (variant === 'temp1') {
        return (
            <footer className="text-white" style={{ backgroundColor: bg }}>
                <div className="site-container py-14">
                    <div className="flex flex-col gap-10 lg:flex-row lg:flex-wrap lg:justify-between lg:gap-16">
                        <div className="space-y-4 lg:max-w-sm">
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
                                        className="h-12 w-auto max-w-[240px] object-contain"
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

                        <div className="grid gap-10 sm:grid-cols-2">
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
                    <div className="site-container flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-white/50">
                            © {new Date().getFullYear()} {branding.name}. All rights
                            reserved.
                        </p>
                        <FooterLegalLinks
                            items={legalItems}
                            linkClassName="text-xs text-white/50 transition hover:text-white"
                        />
                    </div>
                </div>
            </footer>
        )
    }

    if (variant === 'temp3') {
        return (
            <footer className="t3-section-navy border-t border-t3-border text-t3-cream">
                <div className="t3-wrap py-14 md:py-16">
                    <div className="flex flex-col gap-10 lg:flex-row lg:flex-wrap lg:justify-between lg:gap-16">
                        <div className="space-y-4 lg:max-w-sm">
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
                                        className="h-12 w-auto max-w-[240px] object-contain"
                                    />
                                ) : (
                                    <p className="font-display text-xl font-semibold tracking-tight text-t3-cream">
                                        {branding.name}
                                    </p>
                                )}
                            </AgencyLink>
                            <p className="max-w-sm font-ui text-sm leading-relaxed text-t3-muted">
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
                                            className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-t3-border text-t3-cream transition hover:border-t3-gold hover:text-t3-gold"
                                        >
                                            <Icon className="h-[18px] w-[18px]" />
                                        </a>
                                    ))}
                                </div>
                            ) : null}
                        </div>

                        <div className="grid gap-10 sm:grid-cols-2">
                            {columns.map((col) => (
                                <div
                                    key={col.title}
                                    className={cn(
                                        col.title.trim().toLowerCase() === 'contact'
                                            ? 'sm:col-span-2 lg:col-span-1'
                                            : undefined
                                    )}
                                >
                                    <p className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-t3-gold">
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

                    <div className="mt-12 border-t border-t3-border pt-10">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <p className="font-ui text-sm font-medium text-t3-cream/90">
                                Subscribe to our newsletter
                            </p>
                            <form
                                className="flex w-full max-w-sm overflow-hidden rounded-sm border border-t3-border bg-t3-panel p-1"
                                onSubmit={onSubscribe}
                            >
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Your email"
                                    required
                                    className="min-w-0 flex-1 rounded-sm bg-transparent px-4 py-2 font-ui text-sm text-t3-cream outline-none placeholder:text-t3-dim"
                                />
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="t3-btn-solid shrink-0 rounded-sm px-4 py-2 text-sm disabled:opacity-60"
                                >
                                    {isPending ? 'Subscribing' : 'Subscribe'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="border-t border-t3-border">
                    <div className="t3-wrap flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
                        <p className="font-mono text-[11px] tracking-[0.08em] text-t3-dim">
                            © {new Date().getFullYear()} {branding.name}. All rights
                            reserved.
                        </p>
                        <FooterLegalLinks
                            items={legalItems}
                            linkClassName="font-mono text-[11px] tracking-[0.08em] text-t3-dim transition hover:text-t3-cream"
                        />
                    </div>
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
                                className="h-12 w-auto max-w-[240px] object-contain"
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
                <div className="site-container flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-white/50">
                        © {new Date().getFullYear()} {branding.name}. All rights reserved.
                    </p>
                    <FooterLegalLinks
                        items={legalItems}
                        linkClassName="text-xs text-white/50 transition hover:text-white"
                    />
                </div>
            </div>
        </footer>
    )
}
