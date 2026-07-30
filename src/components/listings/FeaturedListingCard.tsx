'use client'

import { Link2 } from 'lucide-react'
import { toast } from 'sonner'
import { AgencyLink } from '@/components/links/AgencyLink'
import { SaveListingButton } from '@/components/listings/SaveListingButton'
import { bookingHrefForListing } from '@/lib/booking/booking-href'
import type { ListingItem } from '@/services/listings/listings.types'
import { cn } from '@/lib/utils/cn'

function formatDeparture(value: string | null | undefined) {
    if (!value) return null
    const date = new Date(`${value}T00:00:00`)
    if (Number.isNaN(date.getTime())) return null
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
    })
}

export function FeaturedListingCard({
    item,
    agencyId,
    index = 0,
}: {
    item: ListingItem
    agencyId?: string
    index?: number
}) {
    const price = item.priceLabel.replace(/^from\s+/i, '')
    const bookHref = bookingHrefForListing({
        kind: item.kind,
        id: item.id,
        slugOrHref: item.href,
        title: item.title,
    })
    const seatsLeft = item.seatsLeft
    const closed =
        seatsLeft != null ? seatsLeft <= 0 : item.travelersCapacity === 0
    const bookLabel =
        item.kind === 'tours'
            ? closed
                ? 'Booking Closed'
                : 'Book Tour'
            : closed
              ? 'Booking Closed'
              : 'Request'
    const departure = formatDeparture(item.departureDate)
    const tripType = (item.tripTypeLabel || 'Public Trip').toUpperCase()
    const discount =
        item.discountPercent && item.discountPercent > 0
            ? Math.round(item.discountPercent)
            : null

    async function onShare(event: React.MouseEvent) {
        event.preventDefault()
        event.stopPropagation()
        try {
            const url = new URL(item.href, window.location.origin)
            const host = new URLSearchParams(window.location.search).get('host')
            if (host) url.searchParams.set('host', host)
            await navigator.clipboard.writeText(url.toString())
            toast.success('Link copied')
        } catch {
            toast.error('Could not copy link')
        }
    }

    return (
        <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <div className="relative aspect-[16/11] overflow-hidden bg-[#E8EEF0]">
                {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div
                        className={cn(
                            'h-full w-full bg-gradient-to-br',
                            index % 2 === 0
                                ? 'from-[#0B6E6A] to-[#0B3D3A]'
                                : 'from-[#1D3557] to-[#2A9D8F]'
                        )}
                    />
                )}

                <div className="absolute left-3 top-3 flex items-center gap-2">
                    <SaveListingButton item={item} agencyId={agencyId} />
                    <button
                        type="button"
                        aria-label="Copy link"
                        onClick={onShare}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#444] shadow-sm transition hover:bg-white/95"
                    >
                        <Link2 className="h-3.5 w-3.5" />
                    </button>
                </div>

                {discount ? (
                    <span className="absolute right-3 top-3 rounded-full bg-[#0B6E6A] px-2.5 py-1 text-[11px] font-semibold text-white">
                        {discount}% off
                    </span>
                ) : null}

                <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                    {tripType}
                </span>
            </div>

            <div className="flex flex-1 flex-col p-5">
                <h3 className="line-clamp-2 text-lg font-bold tracking-tight text-[#111]">
                    {item.title}
                </h3>

                <div className="mt-3 space-y-1.5 text-sm text-[#6B7280]">
                    {departure ? (
                        <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                            <span>{departure}</span>
                            <span className="text-[#C4C7CB]">·</span>
                            <span>
                                {seatsLeft == null
                                    ? 'Seats on request'
                                    : seatsLeft > 0
                                      ? `${seatsLeft} seats left`
                                      : 'Unavailable'}
                            </span>
                        </p>
                    ) : (
                        <p>
                            {seatsLeft == null
                                ? 'Dates on request'
                                : seatsLeft > 0
                                  ? `${seatsLeft} seats left`
                                  : 'Unavailable'}
                        </p>
                    )}
                    {item.location ? (
                        <p className="line-clamp-1 text-xs text-[#9AA0A6]">
                            {item.location}
                        </p>
                    ) : null}
                </div>

                <div className="mt-4 border-t border-[#ECEEF1] pt-4">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        {item.originalPriceLabel ? (
                            <span className="text-sm text-[#9AA0A6] line-through">
                                {item.originalPriceLabel}
                            </span>
                        ) : null}
                        <span className="text-lg font-bold text-[#111]">
                            {price}
                            <span className="ml-1 text-xs font-normal text-[#9AA0A6]">
                                / seat
                            </span>
                        </span>
                    </div>

                    {closed ? (
                        <span className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#9AA0A6] px-4 py-3 text-sm font-semibold text-white">
                            {bookLabel}
                        </span>
                    ) : (
                        <AgencyLink
                            href={bookHref}
                            className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#0B6E6A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#095955]"
                        >
                            {bookLabel}
                        </AgencyLink>
                    )}
                </div>
            </div>
        </article>
    )
}
