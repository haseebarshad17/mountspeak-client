'use client'

import { useMemo, useState } from 'react'
import { EmptyState } from '@/components/ui/EmptyState'
import { FeaturedListingCard } from '@/components/listings/FeaturedListingCard'
import { ListingCard } from '@/components/listings/ListingCard'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import { pillTabClass } from '@/lib/templates/chrome'
import { cn } from '@/lib/utils/cn'
import type { ListingItem } from '@/services/listings/listings.types'
import type {
    AgencySpecializationCapabilities,
    SpecializationKind,
} from '@/services/specialization/specialization.types'

const KIND_TITLES: Record<SpecializationKind, string> = {
    tours: 'Tours',
    packages: 'Packages',
    international: 'International Tours',
}

export function ListingPageContent({
    capabilities,
    allowedKinds,
    listingsByKind,
    agencyId,
}: {
    capabilities: AgencySpecializationCapabilities
    allowedKinds: SpecializationKind[]
    listingsByKind: Record<SpecializationKind, ListingItem[]>
    agencyId: string
}) {
    const variant = useTemplateVariant()
    const availableTabs = useMemo(
        () => capabilities.tabs.filter((tab) => allowedKinds.includes(tab.kind)),
        [allowedKinds, capabilities.tabs]
    )
    const [activeKind, setActiveKind] = useState<SpecializationKind>(
        availableTabs[0]?.kind ?? allowedKinds[0]
    )
    const items = listingsByKind[activeKind] ?? []

    if (availableTabs.length === 0) {
        return (
            <section className="section-spacing section-spacing-top px-4 md:px-6">
                <EmptyState
                    title="Category unavailable"
                    description="This agency plan does not include this category yet."
                />
            </section>
        )
    }

    if (variant === 'temp3') {
        return (
            <section className="t3-section t3-section-soft">
                <div className="t3-wrap">
                    {availableTabs.length > 1 ? (
                        <div className="mb-8 flex flex-wrap justify-center gap-2">
                            {availableTabs.map((tab) => (
                                <button
                                    key={tab.kind}
                                    type="button"
                                    onClick={() => setActiveKind(tab.kind)}
                                    className={cn(
                                        't3-chip',
                                        activeKind === tab.kind
                                            ? 't3-chip-on-cream-active'
                                            : 't3-chip-on-cream hover:border-t3-navy/25'
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    ) : null}

                    <p className="mb-8 text-center font-ui text-sm text-t3-dim">
                        Showing {KIND_TITLES[activeKind]}
                        {items.length ? ` · ${items.length}` : ''}
                    </p>

                    {items.length === 0 ? (
                        <EmptyState
                            title={`No ${KIND_TITLES[activeKind].toLowerCase()} yet`}
                            description="Published listings for this category will appear here."
                        />
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {items.map((item, i) => (
                                <FeaturedListingCard
                                    key={item.id}
                                    item={item}
                                    index={i}
                                    agencyId={agencyId}
                                    appearance="temp3"
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        )
    }

    if (variant === 'temp1') {
        return (
            <section className="section-spacing section-spacing-top bg-white">
                <div className="site-container">
                    {availableTabs.length > 1 ? (
                        <div className="mb-8 flex flex-wrap justify-center gap-2">
                            {availableTabs.map((tab) => (
                                <button
                                    key={tab.kind}
                                    type="button"
                                    onClick={() => setActiveKind(tab.kind)}
                                    className={pillTabClass(
                                        activeKind === tab.kind,
                                        variant
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    ) : null}

                    <p className="mb-6 text-center text-sm text-[#666]">
                        Showing {KIND_TITLES[activeKind]}
                        {items.length ? ` · ${items.length}` : ''}
                    </p>

                    {items.length === 0 ? (
                        <EmptyState
                            title={`No ${KIND_TITLES[activeKind].toLowerCase()} yet`}
                            description="Published listings for this category will appear here."
                        />
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {items.map((item, i) => (
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

    return (
        <section className="pb-20">
            <div className="site-container">
                {availableTabs.length > 1 ? (
                    <div className="mb-6 flex flex-wrap gap-2">
                        {availableTabs.map((tab) => (
                            <button
                                key={tab.kind}
                                type="button"
                                onClick={() => setActiveKind(tab.kind)}
                                className={pillTabClass(activeKind === tab.kind, variant)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                ) : null}

                <div className="mb-4 text-sm text-[#666]">
                    Showing {KIND_TITLES[activeKind]}
                </div>

                {items.length === 0 ? (
                    <EmptyState
                        title={`No ${KIND_TITLES[activeKind].toLowerCase()} yet`}
                        description="Published listings for this category will appear here."
                    />
                ) : (
                    <div className="grid gap-6 md:grid-cols-3">
                        {items.map((item, i) => (
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
