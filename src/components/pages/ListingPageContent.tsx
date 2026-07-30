'use client'

import { useMemo, useState } from 'react'
import { EmptyState } from '@/components/ui/EmptyState'
import { ListingCard } from '@/components/listings/ListingCard'
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
            <section className="px-4 pb-20 md:px-6">
                <EmptyState
                    title="Category unavailable"
                    description="This agency plan does not include this category yet."
                />
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
