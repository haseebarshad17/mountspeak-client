'use client'

import {
    Briefcase,
    Building2,
    Camera,
    Car,
    CheckCircle2,
    Compass,
    Heart,
    MapPinned,
    Mountain,
    Plane,
    Ticket,
    Users,
} from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { MarketingCtaBand } from '@/components/pages/MarketingCtaBand'
import { serviceMeta } from '@/components/home/sections/Services'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import { resolveThemeAssetUrl } from '@/lib/media/resolve-theme-asset'
import { accentSoftClass } from '@/lib/templates/chrome'
import type { OurServicesSection } from '@/services/agency/agency.types'

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

const PROCESS = [
    {
        title: 'Tell us the goal',
        description: 'Destination, dates, group size, and the kind of trip you want.',
    },
    {
        title: 'We assemble the pieces',
        description: 'Stays, transport, and experiences are matched to your plan.',
    },
    {
        title: 'Confirm and go',
        description: 'Clear next steps, documents, and support through departure.',
    },
]

const INCLUDED = [
    'Clear pricing and inclusions',
    'Responsive trip coordination',
    'Trusted stays and transport partners',
    'Help before and during travel',
]

export function ServicesPageGrid({ data }: { data?: OurServicesSection | null }) {
    const variant = useTemplateVariant()
    const items = data?.items ?? []
    const eyebrow = data?.eyebrow || 'What we offer'
    const title = data?.title || 'Our Services'
    const subtitle =
        'From planning to on-ground logistics, every service is designed to keep your trip clear and well supported.'

    if (variant === 'temp3') {
        return (
            <section id="our-services" className="services-temp3">
                <div className="services-temp3-wrap">
                    <div className="services-temp3-head">
                        <p className="services-temp3-eyebrow">{eyebrow}</p>
                        <h2 className="services-temp3-title">{title}</h2>
                        <p className="services-temp3-sub">{subtitle}</p>
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
                                                <Icon strokeWidth={1.5} aria-hidden />
                                            )}
                                        </div>
                                        <h3>{item.title}</h3>
                                        {item.description ? <p>{item.description}</p> : null}
                                        <span className="services-temp3-perf" aria-hidden />
                                        <span className="services-temp3-tag">
                                            {indexLabel} / DEP
                                        </span>
                                    </article>
                                )
                            })}
                        </div>
                    )}
                </div>
            </section>
        )
    }

    if (variant === 'temp1') {
        return (
            <>
                <section className="section-spacing section-spacing-top bg-white">
                    <div className="site-container">
                        <div className="mx-auto mb-10 max-w-2xl text-center">
                            <p className="text-brand text-sm font-medium uppercase">
                                {eyebrow}
                            </p>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111] md:text-4xl">
                                {title}
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-[#666] md:text-base">
                                {subtitle}
                            </p>
                        </div>
                        {items.length === 0 ? (
                            <EmptyState
                                title="Services coming soon"
                                description="Service items from the site theme will appear in this grid."
                            />
                        ) : (
                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {items.map((item, i) => {
                                    const Icon = FALLBACK_ICONS[i % FALLBACK_ICONS.length]
                                    const iconSrc = resolveThemeAssetUrl(item.iconSrc)
                                    return (
                                        <article
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
                                            <h3 className="mt-4 text-lg font-semibold text-[#111]">
                                                {item.title}
                                            </h3>
                                            {item.description ? (
                                                <p className="mt-2 text-sm leading-relaxed text-[#666]">
                                                    {item.description}
                                                </p>
                                            ) : null}
                                        </article>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </section>

                <section className="section-spacing section-spacing-top bg-[#F7FAFA]">
                    <div className="site-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                        <div>
                            <p className="text-brand text-sm font-medium uppercase">
                                How it works
                            </p>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111] md:text-4xl">
                                A calm process from brief to booking
                            </h2>
                            <p className="mt-4 text-sm leading-relaxed text-[#666] md:text-base">
                                No cluttered packages or vague promises — just a clear path to a
                                trip that fits how you travel.
                            </p>
                        </div>
                        <div className="space-y-4">
                            {PROCESS.map((item, i) => (
                                <div
                                    key={item.title}
                                    className="flex gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm"
                                >
                                    <div className="bg-brand-soft flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#111]">{item.title}</h3>
                                        <p className="mt-1 text-sm leading-relaxed text-[#666]">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="section-spacing section-spacing-top bg-white">
                    <div className="site-container">
                        <div className="mx-auto max-w-3xl rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-8">
                            <p className="text-brand text-sm font-medium uppercase">Included care</p>
                            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#111] md:text-3xl">
                                What you can expect from us
                            </h2>
                            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                                {INCLUDED.map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-start gap-2 text-sm text-[#444]"
                                    >
                                        <CheckCircle2 className="text-brand mt-0.5 h-4 w-4 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                <MarketingCtaBand
                    eyebrow="Need a custom plan?"
                    title="Talk to our travel team"
                    subtitle="Share your dates and destinations — we’ll recommend the right service mix."
                    primaryHref="/contact-us"
                    primaryLabel="Contact us"
                    secondaryHref="/tours"
                    secondaryLabel="Browse tours"
                />
            </>
        )
    }

    return (
        <section className="pb-20">
            <div className="site-container">
                {items.length === 0 ? (
                    <EmptyState
                        title="Services coming soon"
                        description="Service items from the site theme will appear in this grid."
                    />
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((item, i) => {
                            const Icon = FALLBACK_ICONS[i % FALLBACK_ICONS.length]
                            const iconSrc = resolveThemeAssetUrl(item.iconSrc)
                            return (
                                <article
                                    key={`${item.title}-${i}`}
                                    className="rounded-2xl bg-white p-6 shadow-sm"
                                >
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ${accentSoftClass(variant)}`}
                                    >
                                        {iconSrc ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={iconSrc}
                                                alt={item.iconAlt || item.title}
                                                className="h-5 w-5 object-contain"
                                            />
                                        ) : (
                                            <Icon className="h-5 w-5" />
                                        )}
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold text-[#111]">
                                        {item.title}
                                    </h3>
                                    {item.description ? (
                                        <p className="mt-2 text-sm leading-relaxed text-[#666]">
                                            {item.description}
                                        </p>
                                    ) : null}
                                </article>
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    )
}
