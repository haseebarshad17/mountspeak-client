'use client'

import { AgencyLink } from '@/components/links/AgencyLink'
import { SaveListingButton } from '@/components/listings/SaveListingButton'
import { bookingHrefForListing } from '@/lib/booking/booking-href'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import {
    isClassicTemplate,
    primaryButtonClass,
} from '@/lib/templates/chrome'
import { CalendarDays, MapPin } from 'lucide-react'
import type { ListingItem } from '@/services/listings/listings.types'
import { cn } from '@/lib/utils/cn'

const FALLBACK_GRADIENTS = [
    'from-[#2A9D8F] to-[#457B9D]',
    'from-[#457B9D] to-[#1D3557]',
    'from-[#264653] to-[#2A9D8F]',
]

export function ListingCard({
    item,
    index = 0,
    agencyId,
}: {
    item: ListingItem
    index?: number
    agencyId?: string
}) {
    const variant = useTemplateVariant()
    const classic = isClassicTemplate(variant)
    const price = item.priceLabel.replace(/^from\s+/i, '')
    const bookHref = bookingHrefForListing({
        kind: item.kind,
        id: item.id,
        slugOrHref: item.href,
        title: item.title,
    })
    const bookLabel = item.kind === 'tours' ? 'Book' : 'Request'
    const departureLabel = item.departureDate
        ? new Date(`${item.departureDate}T00:00:00`).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
          })
        : null

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-sm transition hover:border-black/10 hover:shadow-md">
            <div
                className={cn(
                    'relative aspect-[5/3] overflow-hidden',
                    classic ? 'bg-[#E8EEF0]' : 'bg-[#EDE7DE]'
                )}
            >
                {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                ) : (
                    <div
                        className={cn(
                            'h-full w-full bg-gradient-to-br',
                            classic
                                ? 'from-[var(--color-brand)] to-[color-mix(in_srgb,var(--color-brand)_55%,#000)]'
                                : FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length]
                        )}
                    />
                )}
                {item.durationLabel ? (
                    <span className="absolute left-2.5 top-2.5 rounded-md bg-black/55 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white backdrop-blur-sm">
                        {item.durationLabel}
                    </span>
                ) : null}
                <SaveListingButton
                    item={item}
                    agencyId={agencyId}
                    className="absolute right-2.5 top-2.5"
                />
            </div>

            <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                    {item.badge ? (
                        <span className="text-[10px] font-medium uppercase tracking-wider text-[#888]">
                            {item.badge}
                        </span>
                    ) : (
                        <span />
                    )}
                </div>

                <h3 className="mt-1 line-clamp-2 text-[1.05rem] font-semibold leading-snug text-[#111]">
                    {item.title}
                </h3>

                {item.summary ? (
                    <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-[#666]">
                        {item.summary}
                    </p>
                ) : null}

                <p className="mt-2 flex items-center gap-1 text-xs text-[#888]">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{item.location}</span>
                </p>

                <div className="mt-auto border-t border-black/[0.05] pt-3">
                    <div className="flex items-baseline justify-between gap-2">
                        <p className="text-base font-semibold text-[#111]">
                            {price}
                            <span className="ml-0.5 text-xs font-normal text-[#888]">
                                / person
                            </span>
                        </p>
                    </div>
                    {departureLabel ? (
                        <p className="mt-1 flex items-center gap-1 text-[11px] text-[#888]">
                            <CalendarDays className="h-3 w-3" />
                            Departs {departureLabel}
                        </p>
                    ) : null}

                    <div className="mt-3 flex gap-2">
                        <AgencyLink
                            href={item.href}
                            className={cn(
                                'inline-flex flex-1 items-center justify-center rounded-lg border px-3 py-2 text-xs font-medium transition',
                                classic
                                    ? 'border-black/10 bg-white text-[#111] hover:bg-black/[0.03]'
                                    : 'border-[#111]/12 bg-white text-[#111] hover:bg-[#FAF7F2]'
                            )}
                        >
                            Details
                        </AgencyLink>
                        <AgencyLink
                            href={bookHref}
                            className={primaryButtonClass(
                                variant,
                                'inline-flex flex-1 items-center justify-center rounded-lg px-3 py-2 text-xs font-medium'
                            )}
                        >
                            {bookLabel}
                        </AgencyLink>
                    </div>
                </div>
            </div>
        </article>
    )
}
