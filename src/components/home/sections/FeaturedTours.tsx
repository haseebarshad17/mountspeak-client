'use client'

import { useMemo, useState } from 'react'
import { EmptyState } from '@/components/ui/EmptyState'
import { FeaturedListingCard } from '@/components/listings/FeaturedListingCard'
import { ListingCard } from '@/components/listings/ListingCard'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import type { ExploreTheWorldSection } from '@/services/agency/agency.types'
import type { ListingItem } from '@/services/listings/listings.types'
import type {
    AgencySpecializationCapabilities,
    SpecializationKind,
} from '@/services/specialization/specialization.types'
import { cn } from '@/lib/utils/cn'

export function FeaturedTours({
    data,
    capabilities,
    listingsByKind,
    agencyId,
}: {
    data: ExploreTheWorldSection
    capabilities: AgencySpecializationCapabilities
    listingsByKind: Record<SpecializationKind, ListingItem[]>
    agencyId: string
}) {
    const variant = useTemplateVariant()
    const [activeKind, setActiveKind] = useState(capabilities.defaultKind)
    const listings = useMemo(
        () => listingsByKind[activeKind] ?? [],
        [activeKind, listingsByKind]
    )

    if (variant === 'temp1') {
        const featured = listings.slice(0, 6)

        return (
            <section className="section-spacing bg-white">
                <div className="site-container">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-brand text-sm font-medium uppercase">
                            {data.eyebrow}
                        </p>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111] md:text-4xl">
                            Featured {data.title}
                        </h2>
                        {data.paragraph ? (
                            <p className="mt-3 text-[#333]/70">{data.paragraph}</p>
                        ) : null}
                    </div>

                    {capabilities.showTabs ? (
                        <div className="mt-8 flex flex-wrap justify-center gap-2">
                            {capabilities.tabs.map((tab) => (
                                <button
                                    key={tab.kind}
                                    type="button"
                                    onClick={() => setActiveKind(tab.kind)}
                                    className={cn(
                                        'rounded-full px-4 py-2 text-sm transition',
                                        activeKind === tab.kind
                                            ? 'bg-brand'
                                            : 'border border-black/10 bg-white text-[#333] hover:bg-black/5'
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    ) : null}

                    {featured.length === 0 ? (
                        <div className="mt-10">
                            <EmptyState
                                title={data.emptyMessage || 'No trips published yet'}
                                description="Featured tours and packages will appear here once this agency publishes listings."
                            />
                        </div>
                    ) : (
                        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {featured.map((item, i) => (
                                <FeaturedListingCard
                                    key={item.id}
                                    item={item}
                                    index={i}
                                    agencyId={agencyId}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        )
    }

    if (variant === 'temp2') {
        return (
            <section className="bg-[#FCF8F3] py-16 md:py-20">
                <div className="site-container">
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#888]">
                        {data.eyebrow}
                    </p>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111] md:text-4xl">
                        Featured {data.title}
                    </h2>
                    <p className="mt-3 max-w-2xl text-[#333]/70">{data.paragraph}</p>

                    {capabilities.showTabs ? (
                        <div className="mt-6 flex flex-wrap gap-2">
                            {capabilities.tabs.map((tab) => (
                                <button
                                    key={tab.kind}
                                    type="button"
                                    onClick={() => setActiveKind(tab.kind)}
                                    className={cn(
                                        'rounded-full px-4 py-2 text-sm',
                                        activeKind === tab.kind
                                            ? 'bg-[#06403D] text-white'
                                            : 'bg-white text-[#333]'
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    ) : null}

                    {listings.length === 0 ? (
                        <div className="mt-8">
                            <EmptyState
                                title={data.emptyMessage || 'No trips published yet'}
                                description="Featured tours and packages will appear here once this agency publishes listings."
                            />
                        </div>
                    ) : (
                        <div className="mt-8 grid gap-6 md:grid-cols-3">
                            {listings.map((item, i) => (
                                <ListingCard
                                    key={item.id}
                                    item={item}
                                    index={i}
                                    agencyId={agencyId}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        )
    }

    return null
}
