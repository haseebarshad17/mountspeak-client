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
import { Temp3SectionHeader } from '@/components/home/Temp3SectionHeader'
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
            <>
                <section id="our-services" className="t3-section t3-section-cream">
                    <div className="t3-wrap">
                        <Temp3SectionHeader
                            eyebrow={eyebrow}
                            title={title}
                            subtitle={subtitle}
                            tone="cream"
                        />
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
                                            className="rounded-[14px] border border-t3-navy/10 bg-white p-6 shadow-[0_10px_30px_rgba(14,27,51,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(14,27,51,0.08)]"
                                        >
                                            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-t3-navy/5 text-t3-navy">
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
                                            <h3 className="mt-4 font-display text-lg font-semibold text-t3-navy">
                                                {item.title}
                                            </h3>
                                            {item.description ? (
                                                <p className="mt-2 font-ui text-sm leading-relaxed text-t3-dim">
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

                <section className="t3-section t3-section-soft">
                    <div className="t3-wrap grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                        <div>
                            <p className="t3-eyebrow">How it works</p>
                            <h2 className="t3-title t3-title-on-cream text-left">
                                A calm process from brief to booking
                            </h2>
                            <p className="t3-sub t3-sub-on-cream max-w-md text-left">
                                No cluttered packages or vague promises — just a clear path to a
                                trip that fits how you travel.
                            </p>
                        </div>
                        <div className="space-y-4">
                            {PROCESS.map((item, i) => (
                                <div
                                    key={item.title}
                                    className="flex gap-4 rounded-[14px] border border-t3-navy/10 bg-white p-5 shadow-[0_10px_30px_rgba(14,27,51,0.05)]"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-t3-navy font-mono text-sm font-semibold text-t3-cream">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <h3 className="font-display font-semibold text-t3-navy">
                                            {item.title}
                                        </h3>
                                        <p className="mt-1 font-ui text-sm leading-relaxed text-t3-dim">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="t3-section t3-section-cream">
                    <div className="t3-wrap">
                        <div className="mx-auto max-w-3xl rounded-[16px] border border-t3-navy/10 bg-white p-6 shadow-[0_10px_30px_rgba(14,27,51,0.05)] md:p-8">
                            <p className="t3-eyebrow">Included care</p>
                            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-t3-navy md:text-3xl">
                                What you can expect from us
                            </h2>
                            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                                {INCLUDED.map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-start gap-2 font-ui text-sm text-t3-navy/80"
                                    >
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-t3-gold" />
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
