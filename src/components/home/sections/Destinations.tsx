'use client'

'use client'

import { useMemo, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { AgencyLink } from '@/components/links/AgencyLink'
import { EmptyState } from '@/components/ui/EmptyState'
import { Temp3SectionHeader } from '@/components/home/Temp3SectionHeader'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import { resolveThemeAssetUrl } from '@/lib/media/resolve-theme-asset'
import type { PopularDestinationSection } from '@/services/agency/agency.types'
import { cn } from '@/lib/utils/cn'

export function Destinations({ data }: { data: PopularDestinationSection }) {
    const variant = useTemplateVariant()
    const filters = data.filters?.length ? data.filters : ['All']
    const [active, setActive] = useState(filters[0] ?? 'All')

    const cards = useMemo(() => {
        if (!data.cards?.length) return []
        if (active === 'All') return data.cards
        return data.cards.filter((card) => card.region === active)
    }, [active, data.cards])

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

                    <div className="mt-8 flex justify-center gap-2 flex-wrap pb-2">
                        {filters.slice(0, 12).map((filter) => (
                            <button
                                key={filter}
                                type="button"
                                onClick={() => setActive(filter)}
                                className={cn(
                                    'shrink-0 rounded-full px-4 py-2 text-sm transition',
                                    active === filter
                                        ? 'bg-brand'
                                        : 'border border-black/10 bg-white text-[#333] hover:bg-black/5'
                                )}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    {cards.length === 0 ? (
                        <div className="mt-8">
                            <EmptyState
                                title={
                                    data.topDestinations?.emptyMessage ||
                                    'No destinations found'
                                }
                                description="Destination cards from this agency theme will appear here."
                            />
                        </div>
                    ) : (
                        <div className="-mx-4 mt-8 flex gap-5 overflow-x-auto px-4 pb-4 snap-x snap-mandatory md:-mx-6 md:px-6 scrollbar-hide">
                            {cards.map((card) => {
                                const image = resolveThemeAssetUrl(card.image)
                                return (
                                    <article
                                        key={card.id}
                                        className="group relative w-[280px] shrink-0 snap-start overflow-hidden rounded-2xl bg-[#111] sm:w-[320px]"
                                    >
                                        <div className="aspect-[3/4] overflow-hidden">
                                            {image ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={image}
                                                    alt={card.name}
                                                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-gradient-to-br from-[var(--color-brand)] to-[color-mix(in_srgb,var(--color-brand)_55%,#000)]" />
                                            )}
                                        </div>
                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                                        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                                            <p className="text-[11px] uppercase tracking-[0.16em] text-white/70">
                                                {card.region}
                                            </p>
                                            <h3 className="mt-1 text-xl font-semibold tracking-tight">
                                                {card.name}
                                            </h3>
                                        </div>
                                    </article>
                                )
                            })}
                        </div>
                    )}
                </div>
            </section>
        )
    }

    if (variant === 'temp3') {
        const seeAll = data.topDestinations
        const seeAllLabel = seeAll?.seeAllLabel
            ? seeAll.seeAllLabel.toLowerCase().includes('destination')
                ? seeAll.seeAllLabel
                : `${seeAll.seeAllLabel} destinations`
            : 'See all destinations'

        return (
            <section className="t3-section t3-section-cream">
                <div className="t3-wrap">
                    <Temp3SectionHeader
                        eyebrow={data.eyebrow}
                        title={data.title}
                        tone="cream"
                    />

                    {filters.length > 1 ? (
                        <div className="mb-8 flex flex-wrap justify-center gap-2">
                            {filters.slice(0, 12).map((filter) => (
                                <button
                                    key={filter}
                                    type="button"
                                    onClick={() => setActive(filter)}
                                    className={cn(
                                        't3-chip',
                                        active === filter
                                            ? 't3-chip-on-cream-active'
                                            : 't3-chip-on-cream hover:border-t3-navy/25'
                                    )}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    ) : null}

                    {cards.length === 0 ? (
                        <EmptyState
                            title={
                                data.topDestinations?.emptyMessage ||
                                'No destinations found'
                            }
                            description="Destination cards from this agency theme will appear here."
                        />
                    ) : (
                        <>
                            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 xs:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                                {cards.slice(0, 6).map((card) => {
                                    const image = resolveThemeAssetUrl(card.image)
                                    return (
                                        <article
                                            key={card.id}
                                            className="group relative aspect-[4/3] overflow-hidden rounded-[20px] bg-t3-navy shadow-[0_16px_40px_rgba(14,27,51,0.1)]"
                                        >
                                            {image ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={image}
                                                    alt={card.name}
                                                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-t3-navy to-t3-panel" />
                                            )}

                                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0E1B33]/85 via-[#0E1B33]/35 to-transparent" />

                                            <div className="absolute inset-x-0 bottom-0 p-5 text-left sm:p-6">
                                                <h3 className="font-display text-2xl font-semibold tracking-tight text-white">
                                                    {card.name}
                                                </h3>
                                                {card.region ? (
                                                    <p className="mt-1 font-ui text-sm text-white/85">
                                                        {card.region}
                                                    </p>
                                                ) : null}
                                            </div>
                                        </article>
                                    )
                                })}
                            </div>

                            {seeAll?.seeAllHref ? (
                                <div className="mt-10 flex justify-center md:mt-12">
                                    <AgencyLink
                                        href={seeAll.seeAllHref}
                                        className="inline-flex items-center gap-2 rounded-full bg-t3-navy px-6 py-3 font-ui text-sm font-semibold text-t3-cream transition hover:bg-[#152844]"
                                    >
                                        {seeAllLabel}
                                        <ArrowRight className="h-4 w-4" />
                                    </AgencyLink>
                                </div>
                            ) : null}
                        </>
                    )}
                </div>
            </section>
        )
    }

    if (variant === 'temp2') {
        return (
            <section className="bg-[#FCF8F3] py-16 md:py-20">
                <div className="site-container">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#888]">
                                {data.eyebrow}
                            </p>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111] md:text-4xl">
                                {data.title}
                            </h2>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-2 flex-wrap pb-2">
                        {filters.slice(0, 12).map((filter) => (
                            <button
                                key={filter}
                                type="button"
                                onClick={() => setActive(filter)}
                                className={cn(
                                    'shrink-0 rounded-full px-4 py-2 text-sm transition',
                                    active === filter
                                        ? 'bg-[#111] text-white'
                                        : 'bg-white text-[#333] hover:bg-black/5'
                                )}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    {cards.length === 0 ? (
                        <div className="mt-8">
                            <EmptyState
                                title={
                                    data.topDestinations?.emptyMessage ||
                                    'No destinations found'
                                }
                                description="Destination cards from this agency theme will appear here."
                            />
                        </div>
                    ) : (
                        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {cards.slice(0, 9).map((card) => {
                                const image = resolveThemeAssetUrl(card.image)
                                return (
                                    <article
                                        key={card.id}
                                        className="group relative overflow-hidden rounded-[28px] bg-[#111]"
                                    >
                                        <div className="aspect-[4/5] overflow-hidden">
                                            {image ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={image}
                                                    alt={card.name}
                                                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-gradient-to-br from-[#2A9D8F] to-[#1D3557]" />
                                            )}
                                        </div>
                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                                        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                                            <p className="text-[11px] uppercase tracking-[0.16em] text-white/70">
                                                {card.region}
                                            </p>
                                            <h3 className="mt-1 text-2xl font-semibold tracking-tight">
                                                {card.name}
                                            </h3>
                                            <div className="mt-4 flex items-center justify-between text-sm text-white/85">
                                                <span>Explore destination</span>
                                                {/* <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur">
                                                View
                                            </span> */}
                                            </div>
                                        </div>
                                    </article>
                                )
                            })}
                        </div>
                    )}
                </div>
            </section>
        )
    }

    return null
}
