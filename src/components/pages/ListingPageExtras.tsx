'use client'

import { CalendarDays, MapPinned, Sparkles } from 'lucide-react'
import { MarketingCtaBand } from '@/components/pages/MarketingCtaBand'
import { Temp3SectionHeader } from '@/components/home/Temp3SectionHeader'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'

const HIGHLIGHTS = [
    {
        icon: Sparkles,
        title: 'Curated for this agency',
        description: 'Only published trips from this specialization profile appear here.',
    },
    {
        icon: CalendarDays,
        title: 'Clear departure details',
        description: 'Dates, seats, and pricing stay visible so you can decide with confidence.',
    },
    {
        icon: MapPinned,
        title: 'Destinations that fit',
        description: 'Browse by category and find the route that matches your travel style.',
    },
]

export function ListingPageExtras({
    kindLabel,
}: {
    kindLabel: string
}) {
    const variant = useTemplateVariant()
    if (variant === 'temp2') return null

    if (variant === 'temp3') {
        return (
            <section className="t3-section t3-section-cream">
                <div className="t3-wrap">
                    <Temp3SectionHeader
                        eyebrow="Why book here"
                        title={`${kindLabel} planned with care`}
                        subtitle="Explore options that are ready to book or request — then continue to details when something feels right."
                        tone="cream"
                    />
                    <div className="grid gap-5 md:grid-cols-3">
                        {HIGHLIGHTS.map((item) => {
                            const Icon = item.icon
                            return (
                                <article
                                    key={item.title}
                                    className="rounded-[14px] border border-t3-navy/10 bg-white p-6 shadow-[0_10px_30px_rgba(14,27,51,0.05)]"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-t3-navy/5 text-t3-navy">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="mt-4 font-display text-lg font-semibold text-t3-navy">
                                        {item.title}
                                    </h3>
                                    <p className="mt-2 font-ui text-sm leading-relaxed text-t3-dim">
                                        {item.description}
                                    </p>
                                </article>
                            )
                        })}
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="section-spacing section-spacing-top bg-white">
            <div className="site-container">
                <div className="mx-auto mb-10 max-w-2xl text-center">
                    <p className="text-brand text-sm font-medium uppercase">Why book here</p>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111] md:text-4xl">
                        {kindLabel} planned with care
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-[#666] md:text-base">
                        Explore options that are ready to book or request — then continue to
                        details when something feels right.
                    </p>
                </div>
                <div className="grid gap-5 md:grid-cols-3">
                    {HIGHLIGHTS.map((item) => {
                        const Icon = item.icon
                        return (
                            <article
                                key={item.title}
                                className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
                            >
                                <div className="bg-brand-soft flex h-12 w-12 items-center justify-center rounded-full">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-[#111]">
                                    {item.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-[#666]">
                                    {item.description}
                                </p>
                            </article>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export function ListingPageCta({
    primaryHref = '/contact-us',
}: {
    primaryHref?: string
}) {
    const variant = useTemplateVariant()
    if (variant === 'temp2') return null

    return (
        <MarketingCtaBand
            eyebrow="Need help choosing?"
            title="Talk through your options"
            subtitle="Not sure which trip fits? Reach out and we’ll help you narrow it down."
            primaryHref={primaryHref}
            primaryLabel="Contact us"
            secondaryHref="/search"
            secondaryLabel="Search trips"
        />
    )
}
