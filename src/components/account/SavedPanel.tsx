'use client'

import { AgencyLink } from '@/components/links/AgencyLink'
import { EmptyState } from '@/components/ui/EmptyState'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import { primaryButtonClass } from '@/lib/templates/chrome'
import { useSavedListings } from '@/services/saved-listings/saved-listings.query'
import { isValidAgencyId } from '@/services/specialization/specialization.service'

export function SavedPanel({ agencyId }: { agencyId: string }) {
    const variant = useTemplateVariant()
    const scopedId = isValidAgencyId(agencyId) ? agencyId : 'default'
    const { items, remove } = useSavedListings(scopedId)

    if (items.length === 0) {
        return (
            <div>
                <EmptyState
                    title="Nothing saved yet"
                    description="Save tours and packages while browsing, then revisit them here."
                />
                <div className="mt-4">
                    <AgencyLink
                        href="/tours"
                        className={primaryButtonClass(
                            variant,
                            'inline-flex rounded-full px-5 py-2.5 text-sm font-medium'
                        )}
                    >
                        Explore tours
                    </AgencyLink>
                </div>
            </div>
        )
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
                <article
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm"
                >
                    <div className="aspect-[5/3] bg-[#EDE7DE]">
                        {item.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="h-full w-full object-cover"
                            />
                        ) : null}
                    </div>
                    <div className="p-4">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-[#888]">
                            {item.kind}
                        </p>
                        <h3 className="mt-1 line-clamp-2 font-semibold text-[#111]">
                            {item.title}
                        </h3>
                        <p className="mt-1 text-xs text-[#888]">{item.location}</p>
                        <p className="mt-2 text-sm font-medium text-[#111]">
                            {item.priceLabel}
                        </p>
                        <div className="mt-3 flex gap-2">
                            <AgencyLink
                                href={item.href}
                                className={primaryButtonClass(
                                    variant,
                                    'inline-flex flex-1 items-center justify-center rounded-lg px-3 py-2 text-xs font-medium'
                                )}
                            >
                                View
                            </AgencyLink>
                            <button
                                type="button"
                                onClick={() => remove(item.id)}
                                className="rounded-lg border border-black/10 px-3 py-2 text-xs font-medium text-[#666]"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    )
}
