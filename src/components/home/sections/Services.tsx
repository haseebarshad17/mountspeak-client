'use client'

import { AgencyLink } from '@/components/links/AgencyLink'
import { EmptyState } from '@/components/ui/EmptyState'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import { resolveThemeAssetUrl } from '@/lib/media/resolve-theme-asset'
import type { OurServicesSection } from '@/services/agency/agency.types'
import {
    Briefcase,
    Building2,
    Camera,
    Car,
    Compass,
    Heart,
    Mountain,
    Plane,
    Ticket,
    Users,
    MapPinned,
} from 'lucide-react'

const FALLBACK_ICONS = [
    Heart,
    Users,
    Mountain,
    Building2,
    Camera,
    Plane,
    Briefcase,
    Users,
    Compass,
    Car,
    Ticket,
    MapPinned,
]

const CODE_BY_KEYWORD: Array<{ match: RegExp; code: string; tag: string }> = [
    { match: /honeymoon/i, code: 'HNY', tag: '+ MOON' },
    { match: /corporate|group/i, code: 'GRP', tag: '+ TOUR' },
    { match: /adventure|trekking/i, code: 'TRK', tag: '+ PEAK' },
    { match: /hotel|resort/i, code: 'HTL', tag: '+ STAY' },
    { match: /photo|media/i, code: 'PHO', tag: '+ SHOT' },
    { match: /air|ticket/i, code: 'AIR', tag: '+ FLY' },
    { match: /wedding/i, code: 'WED', tag: '+ RING' },
    { match: /family/i, code: 'FAM', tag: '+ TRIP' },
    { match: /transport/i, code: 'TRN', tag: '+ RIDE' },
    { match: /northern|pakistan/i, code: 'NTH', tag: '+ VIEW' },
]

function serviceMeta(title: string, index: number) {
    const hit = CODE_BY_KEYWORD.find((entry) => entry.match.test(title))
    if (hit) return { code: hit.code, tag: hit.tag }

    const words = title
        .replace(/[^a-zA-Z\s&]/g, '')
        .split(/\s+/)
        .filter(Boolean)
    const skip = new Set(['and', 'or', 'the', 'a', '&', 'of', 'for'])
    const meaningful = words.filter((w) => !skip.has(w.toLowerCase()))
    const code = (
        meaningful.map((w) => w[0]).join('').slice(0, 3) || `S${index + 1}`
    )
        .toUpperCase()
        .padEnd(3, 'X')
        .slice(0, 3)
    const tagWord = (meaningful[meaningful.length - 1] || 'SVC')
        .slice(0, 4)
        .toUpperCase()
    return { code, tag: `+ ${tagWord}` }
}

function getServicesCta(data: OurServicesSection) {
    return {
        href: '/services',
        label: data.cta?.label?.trim() || 'See all Services',
    }
}

export function Services({ data }: { data: OurServicesSection }) {
    const variant = useTemplateVariant()
    const items = data.items ?? []
    const cta = getServicesCta(data)

    if (variant === 'temp1') {
        return (
            <section className="section-spacing bg-white">
                <div className="site-container">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-brand text-sm font-medium uppercase">
                            {data.eyebrow}
                        </p>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111] md:text-4xl">
                            {data.title}
                        </h2>
                    </div>

                    {items.length === 0 ? (
                        <div className="mt-10">
                            <EmptyState
                                title="Services coming soon"
                                description="Service items from the site theme will appear in this grid."
                            />
                        </div>
                    ) : (
                        <>
                            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                {items.map((item, i) => {
                                    const Icon = FALLBACK_ICONS[i % FALLBACK_ICONS.length]
                                    const iconSrc = resolveThemeAssetUrl(item.iconSrc)
                                    return (
                                        <div
                                            key={`${item.title}-${i}`}
                                            className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:shadow-md"
                                        >
                                            <div className="bg-brand-soft flex h-12 w-12 items-center justify-center overflow-hidden rounded-full">
                                                {iconSrc ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={iconSrc}
                                                        alt={item.iconAlt || item.title}
                                                        className="h-6 w-6 object-contain"
                                                    />
                                                ) : (
                                                    <Icon className="h-5 w-5" />
                                                )}
                                            </div>
                                            <p className="mt-4 text-base font-semibold leading-snug text-[#111]">
                                                {item.title}
                                            </p>
                                            {item.description ? (
                                                <p className="mt-2 text-sm leading-relaxed text-[#666]">
                                                    {item.description}
                                                </p>
                                            ) : null}
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="mt-10 flex justify-center md:mt-12">
                                <AgencyLink
                                    href={cta.href}
                                    className="btn-brand inline-flex rounded-full px-6 py-3 text-sm font-semibold"
                                >
                                    {cta.label}
                                </AgencyLink>
                            </div>
                        </>
                    )}
                </div>
            </section>
        )
    }

    /* ── Template 3 (Modern): navy ticket cards ── */
    if (variant === 'temp3') {
        return (
            <section className="services-temp3">
                <div className="services-temp3-wrap">
                    <div className="services-temp3-head">
                        <p className="services-temp3-eyebrow">{data.eyebrow}</p>
                        <h2 className="services-temp3-title">{data.title}</h2>
                        <p className="services-temp3-sub">
                            Every journey, ticketed and taken care of.
                        </p>
                    </div>

                    {items.length === 0 ? (
                        <EmptyState
                            className="border-white/10 bg-white/5 text-left text-[#F7F3E8]"
                            title="Services coming soon"
                            description="Service items from the site theme will appear in this grid."
                        />
                    ) : (
                        <div className="services-temp3-grid">
                            {items.map((item, i) => {
                                const Icon = FALLBACK_ICONS[i % FALLBACK_ICONS.length]
                                const iconSrc = resolveThemeAssetUrl(item.iconSrc)
                                const meta = serviceMeta(item.title, i)
                                const indexLabel = String(i + 1).padStart(2, '0')

                                return (
                                    <article
                                        key={`${item.title}-${i}`}
                                        className="services-temp3-card"
                                    >
                                        <div className="services-temp3-code">
                                            <span>{meta.code}</span>
                                            <span>{meta.tag}</span>
                                        </div>

                                        <div className="services-temp3-icon">
                                            {iconSrc ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={iconSrc}
                                                    alt={item.iconAlt || item.title}
                                                />
                                            ) : (
                                                <Icon
                                                    strokeWidth={1.5}
                                                    aria-hidden
                                                />
                                            )}
                                        </div>

                                        <h3>{item.title}</h3>
                                        {item.description ? (
                                            <p>{item.description}</p>
                                        ) : null}

                                        <span
                                            className="services-temp3-perf"
                                            aria-hidden
                                        />
                                        <span className="services-temp3-tag">
                                            {indexLabel} / DEP
                                        </span>
                                    </article>
                                )
                            })}
                        </div>
                    )}

                    {items.length > 0 ? (
                        <div className="mt-10 flex justify-center md:mt-12">
                            <AgencyLink
                                href={cta.href}
                                className="t3-btn t3-btn-gold"
                            >
                                {cta.label}
                            </AgencyLink>
                        </div>
                    ) : null}
                </div>
            </section>
        )
    }

    if (variant === 'temp2') {
        return (
            <section className="px-4 py-16 md:px-6 md:py-20">
                <div
                    className="mx-auto rounded-[32px] px-6 py-12 text-black md:px-10 md:py-16"
                    style={{ backgroundColor: data.backgroundColor || '#06403D' }}
                >
                    <div className="site-container">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <p className="text-sm uppercase tracking-[0.18em] text-black">
                                    {data.eyebrow}
                                </p>
                                <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                                    {data.title}
                                </h2>
                            </div>
                            {items.length > 0 ? (
                                <AgencyLink
                                    href={cta.href}
                                    className="rounded-full bg-black/85 px-5 py-2.5 text-sm font-medium text-white"
                                >
                                    {cta.label}
                                </AgencyLink>
                            ) : null}
                        </div>

                        {items.length === 0 ? (
                            <div className="mt-10">
                                <EmptyState
                                    className="border-white/20 bg-white/5 text-left"
                                    title="Services coming soon"
                                    description="Service items from the site theme will appear in this grid."
                                />
                            </div>
                        ) : (
                            <>
                                <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    {items.map((item, i) => {
                                        const Icon =
                                            FALLBACK_ICONS[i % FALLBACK_ICONS.length]
                                        const iconSrc = resolveThemeAssetUrl(
                                            item.iconSrc
                                        )
                                        return (
                                            <div
                                                key={`${item.title}-${i}`}
                                                className="rounded-2xl border border-black/10 bg-white/5 p-5 transition hover:bg-white/10"
                                            >
                                                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white/30">
                                                    {iconSrc ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={iconSrc}
                                                            alt={
                                                                item.iconAlt ||
                                                                item.title
                                                            }
                                                            className="h-6 w-6 object-contain"
                                                        />
                                                    ) : (
                                                        <Icon className="h-5 w-5" />
                                                    )}
                                                </div>
                                                <p className="mt-4 text-sm font-medium leading-snug">
                                                    {item.title}
                                                </p>
                                                {item.description ? (
                                                    <p className="mt-2 text-xs leading-relaxed text-black/65">
                                                        {item.description}
                                                    </p>
                                                ) : null}
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="mt-10 flex justify-center md:mt-12">
                                    <AgencyLink
                                        href={cta.href}
                                        className="rounded-full bg-black/85 px-5 py-2.5 text-sm font-medium text-white"
                                    >
                                        {cta.label}
                                    </AgencyLink>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>
        )
    }

    return null
}
