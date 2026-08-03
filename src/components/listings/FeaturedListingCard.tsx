'use client'

import { CalendarDays, Link2, Mountain, Star } from 'lucide-react'
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
        year: 'numeric',
    })
}

function difficultyTone(label: string) {
    const value = label.toLowerCase()
    if (value.includes('easy') || value.includes('beginner')) {
        return 'bg-[#E7F6EE] text-[#1F7A4D]'
    }
    if (value.includes('hard') || value.includes('challenging') || value.includes('difficult')) {
        return 'bg-[#FDECEC] text-[#B42318]'
    }
    return 'bg-[#FFF4E8] text-[#B54708]'
}

function Temp3FeaturedCard({
    item,
    agencyId,
    index,
}: {
    item: ListingItem
    agencyId?: string
    index: number
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
                : 'Book Now'
            : closed
              ? 'Booking Closed'
              : 'Request'
    const departure = formatDeparture(item.departureDate)
    const duration = item.durationLabel
    const rating = item.ratingLabel
    const reviews = item.reviewCount
    const chip = item.badge || item.tripTypeLabel
    const summary = item.summary

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-[18px] bg-white shadow-[0_16px_40px_rgba(14,27,51,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(14,27,51,0.12)]">
            <div className="relative aspect-[16/11] overflow-hidden bg-t3-cream">
                {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                ) : (
                    <div
                        className={cn(
                            'h-full w-full bg-gradient-to-br',
                            index % 2 === 0
                                ? 'from-t3-navy to-t3-panel'
                                : 'from-t3-panel to-[#1a3358]'
                        )}
                    />
                )}

                {duration ? (
                    <span className="absolute left-3 top-3 rounded-full bg-t3-navy px-3 py-1.5 font-ui text-[11px] font-semibold text-t3-cream shadow-sm">
                        {duration}
                    </span>
                ) : null}

                <div className="absolute right-3 top-3">
                    <SaveListingButton item={item} agencyId={agencyId} />
                </div>
            </div>

            <div className="flex flex-1 flex-col p-5">
                <div className="flex flex-wrap items-center gap-2.5">
                    {chip ? (
                        <span
                            className={cn(
                                'inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-ui text-[11px] font-semibold',
                                difficultyTone(chip)
                            )}
                        >
                            <Mountain className="h-3 w-3" strokeWidth={2.25} />
                            {chip}
                        </span>
                    ) : null}
                    {rating ? (
                        <span className="inline-flex items-center gap-1 font-ui text-[12px] font-medium text-t3-navy/70">
                            <Star className="h-3.5 w-3.5 fill-[#E89C5D] text-[#E89C5D]" />
                            {rating}
                            {reviews != null ? (
                                <span className="text-t3-dim">({reviews})</span>
                            ) : null}
                        </span>
                    ) : null}
                </div>

                <h3 className="mt-3 line-clamp-2 font-display text-[1.15rem] font-semibold leading-snug tracking-tight text-t3-navy">
                    {item.title}
                </h3>

                {summary ? (
                    <p className="mt-2 line-clamp-2 font-ui text-[13px] leading-relaxed text-t3-dim">
                        {summary}
                    </p>
                ) : null}

                <div className="mt-4">
                    <p className="font-display text-xl font-semibold tracking-tight text-t3-navy">
                        {price}
                        <span className="ml-1 font-ui text-xs font-normal text-t3-dim">
                            / person
                        </span>
                    </p>
                    {departure ? (
                        <p className="mt-1.5 inline-flex items-center gap-1.5 font-ui text-[12px] text-t3-dim">
                            <CalendarDays className="h-3.5 w-3.5" />
                            Next departure: {departure}
                        </p>
                    ) : null}
                </div>

                <div className="mt-auto flex items-center gap-2 pt-5">
                    <AgencyLink
                        href={item.href}
                        className="inline-flex flex-1 items-center justify-center rounded-full bg-t3-navy px-3 py-2.5 font-ui text-[12px] font-semibold text-t3-cream transition hover:bg-[#152844]"
                    >
                        View Details
                    </AgencyLink>

                    {closed ? (
                        <span className="inline-flex flex-1 items-center justify-center rounded-full bg-t3-dim px-3 py-2.5 font-ui text-[12px] font-semibold text-white">
                            {bookLabel}
                        </span>
                    ) : (
                        <AgencyLink
                            href={bookHref}
                            className="inline-flex flex-1 items-center justify-center rounded-full bg-[#E89C5D] px-3 py-2.5 font-ui text-[12px] font-semibold text-white transition hover:bg-[#d8894a]"
                        >
                            {bookLabel}
                        </AgencyLink>
                    )}
                </div>
            </div>
        </article>
    )
}

export function FeaturedListingCard({
    item,
    agencyId,
    index = 0,
    appearance = 'default',
}: {
    item: ListingItem
    agencyId?: string
    index?: number
    appearance?: 'default' | 'temp3'
}) {
    if (appearance === 'temp3') {
        return (
            <Temp3FeaturedCard item={item} agencyId={agencyId} index={index} />
        )
    }

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
                                ? 'from-[var(--color-brand)] to-[color-mix(in_srgb,var(--color-brand)_55%,#000)]'
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
                    <span className="bg-brand absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold">
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
                        <div className="mt-4 flex gap-2">
                            <AgencyLink
                                href={item.href}
                                className="inline-flex flex-1 items-center justify-center rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-[#111] transition hover:bg-black/[0.03]"
                            >
                                Details
                            </AgencyLink>
                            <AgencyLink
                                href={bookHref}
                                className="btn-brand inline-flex flex-1 items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold"
                            >
                                {bookLabel}
                            </AgencyLink>
                        </div>
                    )}
                </div>
            </div>
        </article>
    )
}
