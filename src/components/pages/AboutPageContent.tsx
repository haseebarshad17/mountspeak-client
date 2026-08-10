'use client'

import { Compass, MapPin, ShieldCheck, Users } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { MarketingCtaBand } from '@/components/pages/MarketingCtaBand'
import { Temp3SectionHeader } from '@/components/home/Temp3SectionHeader'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import type { AboutUsDocument } from '@/services/content-pages/content-pages.types'

const VALUE_ICONS: Record<string, typeof Compass> = {
    map: Compass,
    shield: ShieldCheck,
    location: MapPin,
    users: Users,
}

function resolveAboutHref(url: string) {
    if (url === '/contact') return '/contact-us'
    return url
}

export function AboutPageContent({ about }: { about?: AboutUsDocument | null }) {
    const variant = useTemplateVariant()

    if (!about) {
        return (
            <section className={variant === 'temp3' ? 't3-section t3-section-cream' : 'section-spacing section-spacing-top'}>
                <div className={variant === 'temp3' ? 't3-wrap' : 'site-container'}>
                    <EmptyState
                        title="About page unavailable"
                        description="About Us content for this agency has not been published yet."
                    />
                </div>
            </section>
        )
    }

    const mission = about.mission
    const stats = about.statistics ?? []
    const values = about.values
    const aboutCompany = about.aboutCompany
    const cta = about.cta
    const ctaButtons = cta?.buttons ?? []
    const primaryButton = ctaButtons.find((b) => b.variant !== 'secondary') ?? ctaButtons[0]
    const secondaryButton = ctaButtons.find((b) => b !== primaryButton)

    if (variant === 'temp3') {
        return (
            <>
                {mission ? (
                    <section className="t3-section t3-section-cream">
                        <div className="t3-wrap mx-auto max-w-3xl text-center">
                            <h2 className="t3-title t3-title-on-cream">{mission.title}</h2>
                            <div className="mt-6 space-y-4 text-left sm:text-center">
                                {mission.description.map((paragraph) => (
                                    <p key={paragraph} className="t3-sub t3-sub-on-cream">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </section>
                ) : null}

                {stats.length > 0 ? (
                    <section className="t3-section t3-section-soft">
                        <div className="t3-wrap mx-auto max-w-4xl">
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {stats.map((stat) => (
                                    <div
                                        key={stat.id}
                                        className="rounded-[14px] border border-t3-navy/10 bg-white px-4 py-6 text-center shadow-[0_10px_30px_rgba(14,27,51,0.05)]"
                                    >
                                        <p className="font-display text-2xl font-semibold tracking-tight text-t3-navy">
                                            {stat.value}
                                        </p>
                                        <p className="mt-1.5 font-ui text-xs leading-snug text-t3-dim">
                                            {stat.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                ) : null}

                {values ? (
                    <section className="t3-section t3-section-cream">
                        <div className="t3-wrap">
                            <Temp3SectionHeader title={values.title} tone="cream" />
                            <div className="grid gap-5 md:grid-cols-2">
                                {values.items.map((item) => {
                                    const Icon = VALUE_ICONS[item.icon ?? ''] ?? Compass
                                    return (
                                        <article
                                            key={item.id}
                                            className="rounded-[14px] border border-t3-navy/10 bg-white p-6 shadow-[0_10px_30px_rgba(14,27,51,0.05)]"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-t3-navy/5 text-t3-navy">
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <h3 className="font-display text-lg font-semibold text-t3-navy">
                                                    {item.title}
                                                </h3>
                                            </div>
                                            <p className="mt-3 font-ui text-sm leading-relaxed text-t3-dim">
                                                {item.description}
                                            </p>
                                        </article>
                                    )
                                })}
                            </div>
                        </div>
                    </section>
                ) : null}

                {aboutCompany ? (
                    <section className="t3-section t3-section-soft">
                        <div className="t3-wrap mx-auto max-w-3xl">
                            <div className="rounded-[16px] border border-t3-navy/10 bg-white p-6 shadow-[0_10px_30px_rgba(14,27,51,0.05)] sm:p-10">
                                <h2 className="t3-title t3-title-on-cream text-center">
                                    {aboutCompany.title}
                                </h2>
                                <div className="mt-6 space-y-4">
                                    {aboutCompany.description.map((paragraph) => (
                                        <p
                                            key={paragraph}
                                            className="font-ui text-sm leading-relaxed text-t3-dim"
                                        >
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                ) : null}

                {cta ? (
                    <MarketingCtaBand
                        title={cta.title}
                        subtitle={cta.subtitle || ''}
                        primaryHref={resolveAboutHref(primaryButton?.url || '/tours')}
                        primaryLabel={primaryButton?.text || 'Explore tours'}
                        secondaryHref={
                            secondaryButton ? resolveAboutHref(secondaryButton.url) : undefined
                        }
                        secondaryLabel={secondaryButton?.text}
                    />
                ) : null}
            </>
        )
    }

    return (
        <>
            {mission ? (
                <section className="section-spacing section-spacing-top bg-white">
                    <div className="site-container mx-auto max-w-3xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-[#111] md:text-4xl">
                            {mission.title}
                        </h2>
                        <div className="mt-6 space-y-4 text-left sm:text-center">
                            {mission.description.map((paragraph) => (
                                <p
                                    key={paragraph}
                                    className="text-[0.98rem] leading-relaxed text-[#333]/70"
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}

            {stats.length > 0 ? (
                <section className="section-spacing section-spacing-top bg-[#F7FAFA]">
                    <div className="site-container mx-auto max-w-4xl">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {stats.map((stat) => (
                                <div
                                    key={stat.id}
                                    className="rounded-2xl border border-black/5 bg-white px-4 py-6 text-center shadow-sm"
                                >
                                    <p className="text-2xl font-bold text-[#111]">{stat.value}</p>
                                    <p className="mt-1 text-xs text-[#666]">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}

            {values ? (
                <section className="section-spacing section-spacing-top bg-white">
                    <div className="site-container">
                        <div className="mx-auto mb-10 max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-[#111] md:text-4xl">
                                {values.title}
                            </h2>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            {values.items.map((item) => {
                                const Icon = VALUE_ICONS[item.icon ?? ''] ?? Compass
                                return (
                                    <article
                                        key={item.id}
                                        className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="bg-brand-soft flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-[#111]">
                                                {item.title}
                                            </h3>
                                        </div>
                                        <p className="mt-3 text-sm leading-relaxed text-[#666]">
                                            {item.description}
                                        </p>
                                    </article>
                                )
                            })}
                        </div>
                    </div>
                </section>
            ) : null}

            {aboutCompany ? (
                <section className="section-spacing section-spacing-top bg-[#F7FAFA]">
                    <div className="site-container mx-auto max-w-3xl">
                        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm sm:p-10">
                            <h2 className="text-center text-3xl font-bold tracking-tight text-[#111] md:text-4xl">
                                {aboutCompany.title}
                            </h2>
                            <div className="mt-6 space-y-4">
                                {aboutCompany.description.map((paragraph) => (
                                    <p
                                        key={paragraph}
                                        className="text-sm leading-relaxed text-[#666]"
                                    >
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            ) : null}

            {cta ? (
                <MarketingCtaBand
                    title={cta.title}
                    subtitle={cta.subtitle || ''}
                    primaryHref={resolveAboutHref(primaryButton?.url || '/tours')}
                    primaryLabel={primaryButton?.text || 'Explore tours'}
                    secondaryHref={
                        secondaryButton ? resolveAboutHref(secondaryButton.url) : undefined
                    }
                    secondaryLabel={secondaryButton?.text}
                />
            ) : null}

            {!mission && stats.length === 0 && !values && !aboutCompany && !cta ? (
                <section className="section-spacing section-spacing-top">
                    <div className="site-container">
                        <EmptyState
                            title="About page unavailable"
                            description="About Us content for this agency has not been published yet."
                        />
                    </div>
                </section>
            ) : null}
        </>
    )
}
