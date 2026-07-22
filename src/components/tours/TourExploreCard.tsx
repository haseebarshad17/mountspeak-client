'use client'

import { TourMediaImage } from '@/components/pages/tour/TourMediaImage'
import { HP_THEME_BTN_CLASS, HP_THEME_BTN_STYLE } from '@/data/homepage'
import { DEMO_TOUR_DETAIL_PATH } from '@/lib/tours/default-tour-page'
import { cn } from '@/lib/utils/clsxUtils'
import Link from 'next/link'

import { usePrefixedHref } from '@/hooks/useAgencyPreviewBase'
import type { ListingKind } from '@/lib/homepage/specialization'
import { getTourCategoryLabel, type TourCategory } from '@/services/tours/tours.category'
import type { TourListDepartureSlot } from '@/services/tours/tours.types'
import {
    formatTourDaysLeft,
    formatTourListSlotAvailability,
    formatTourListSlotLabel,
    formatTourPrice,
    getTourDiscountedPricePerSeat,
    listingDetailPath,
} from '@/services/tours/tours.utils'

import { TourDiscountBadge } from './TourDiscountBadge'
import { TourSaveShareActions } from './TourSaveShareActions'

type TourExploreCardProps = {
    slug: string
    tourId?: string
    listingKind?: ListingKind
    discountPercent?: number | null
    pricePerSeat?: number | null
    /** From package pricing.currency; domestic tours default to PKR. */
    currency?: string | null
    title: string
    category?: TourCategory | null
    image: string
    detailHref?: string
    totalBooked?: number
    remainingSeats?: number | null
    daysLeft?: number | null
    departureDate?: string | null
    departureSlots?: TourListDepartureSlot[]
    bookLabel?: string
    isBookingClosed?: boolean
}

function formatRemainingSeats(remainingSeats: number | null | undefined): string {
    if (remainingSeats == null) return 'N/A'
    return String(remainingSeats)
}

function TourCardAvailability({
    departureSlots,
    daysLeft,
    departureDate,
    totalBooked,
    remainingSeats,
}: {
    departureSlots: TourListDepartureSlot[]
    daysLeft: number | null | undefined
    departureDate: string | null | undefined
    totalBooked: number
    remainingSeats: number | null | undefined
}) {
    if (departureSlots.length > 0) {
        return (
            <ul className='mt-1 space-y-0.5' aria-label='Departure dates and seats remaining'>
                {departureSlots.map((slot) => (
                    <li key={slot.id} className='text-[11px] leading-4 text-[#707979] sm:text-xs'>
                        <span className='font-medium text-[#404849]'>
                            {formatTourListSlotLabel(slot)}
                        </span>
                        <span className='mx-1.5 text-[#D6D9DC]' aria-hidden>
                            ·
                        </span>
                        <span
                            className={cn(
                                'font-medium',
                                slot.isBookable ? 'text-[#404849]' : 'text-[#9AA3A8]',
                            )}
                        >
                            {slot.isBookable
                                ? formatTourListSlotAvailability(slot.availableSeats)
                                : 'Unavailable'}
                        </span>
                    </li>
                ))}
            </ul>
        )
    }

    const daysLeftLabel = formatTourDaysLeft(daysLeft, departureDate)

    return (
        <p className='mt-1 text-[11px] leading-4 text-[#707979] sm:text-xs'>
            {daysLeftLabel ? (
                <>
                    <span className='font-semibold text-[var(--hp-color-primary)]'>
                        {daysLeftLabel}
                    </span>
                    <span className='mx-1.5 text-[#D6D9DC]' aria-hidden>
                        ·
                    </span>
                </>
            ) : null}
            <span className='font-medium text-[#404849]'>{totalBooked}</span> booked
            <span className='mx-1.5 text-[#D6D9DC]' aria-hidden>
                ·
            </span>
            <span className='font-medium text-[#404849]'>{formatRemainingSeats(remainingSeats)}</span>{' '}
            seats left
        </p>
    )
}

export function TourExploreCard({
    slug,
    tourId,
    listingKind = 'tour',
    discountPercent,
    pricePerSeat = null,
    currency = null,
    title,
    category = null,
    image,
    detailHref,
    totalBooked = 0,
    remainingSeats = null,
    daysLeft = null,
    departureDate = null,
    departureSlots = [],
    bookLabel = 'Book Tour',
    isBookingClosed = false,
}: TourExploreCardProps) {
    const rawDetailPath =
        detailHref ??
        listingDetailPath({
            id: tourId ?? slug,
            slug,
            listingKind,
            detailHref,
        })
    const isDemoDetail = rawDetailPath === DEMO_TOUR_DETAIL_PATH
    const prefixedDetailPath = usePrefixedHref(isDemoDetail ? undefined : rawDetailPath)
    const detailPath = isDemoDetail ? DEMO_TOUR_DETAIL_PATH : (prefixedDetailPath ?? rawDetailPath)

    const hasPrice = pricePerSeat != null && pricePerSeat > 0
    const discountedPrice = hasPrice
        ? getTourDiscountedPricePerSeat(pricePerSeat, discountPercent)
        : null
    const showOriginalPrice =
        hasPrice &&
        discountedPrice != null &&
        pricePerSeat != null &&
        discountedPrice < pricePerSeat
    const showSaveShare = Boolean(tourId) && !isDemoDetail
    const categoryLabel = getTourCategoryLabel(category)

    return (
        <Link
            href={detailPath}
            aria-label={`View ${bookLabel.toLowerCase().includes('package') ? 'package' : 'tour'}: ${title}`}
            className={cn(
                'group relative mx-auto flex h-full w-full max-w-[416px] flex-col overflow-hidden',
                'rounded-xl border border-[#E3E8EA] bg-white',
                'shadow-[0_1px_8px_rgba(0,41,44,0.05)]',
                'transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C0C8C9] hover:shadow-[0_8px_24px_rgba(0,41,44,0.1)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hp-color-primary)]/30 focus-visible:ring-offset-2',
                'lg:mx-0',
            )}
        >
            <div className='relative aspect-[16/10] overflow-hidden bg-[#EEF2F3]'>
                <TourMediaImage
                    src={image}
                    alt=''
                    fill
                    className='object-cover transition-transform duration-500 group-hover:scale-[1.03]'
                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 416px'
                />

                {showSaveShare && tourId ? (
                    <TourSaveShareActions
                        tourId={tourId}
                        listingKind={listingKind}
                        shareHref={detailPath}
                        className='absolute left-3 top-3'
                    />
                ) : null}

                <TourDiscountBadge discountPercent={discountPercent} />
                {categoryLabel ? (
                    <span className='absolute bottom-3 right-3 rounded-full border border-white/30 bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm'>
                        {categoryLabel}
                    </span>
                ) : null}
            </div>

            <div className='flex flex-1 flex-col px-3.5 py-3 sm:px-4 sm:py-3.5'>
                <h3 className='truncate font-jost text-[15px] font-semibold leading-5 text-[#14141F] transition-colors group-hover:text-[var(--hp-color-primary)] sm:text-base'>
                    {title}
                </h3>

                <TourCardAvailability
                    departureSlots={departureSlots}
                    daysLeft={daysLeft}
                    departureDate={departureDate}
                    totalBooked={totalBooked}
                    remainingSeats={remainingSeats}
                />

                <div className='mt-3 flex flex-1 flex-col border-t border-[#e0e1e2] pt-3'>
                    {hasPrice && discountedPrice != null ? (
                        <div>
                            <div className='mt-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5'>
                                {showOriginalPrice ? (
                                    <span
                                        className='text-[13px] font-medium text-[#9AA3A8] line-through decoration-[#9AA3A8] decoration-1'
                                        aria-label={`Original price ${formatTourPrice(pricePerSeat, currency, listingKind)}`}
                                    >
                                        {formatTourPrice(pricePerSeat, currency, listingKind)}
                                    </span>
                                ) : null}
                                <span className='font-jost text-lg font-bold leading-none tracking-tight text-[#012b32] tabular-nums sm:text-xl'>
                                    {formatTourPrice(discountedPrice, currency, listingKind)}
                                </span>
                                <span className='text-[11px] text-[#707979]'>/ seat</span>
                            </div>
                        </div>
                    ) : (
                        <p className='text-sm font-medium text-[#707979]'>Price on request</p>
                    )}

                    <span
                        className={cn(
                            'mt-3 inline-flex h-10 w-full items-center justify-center rounded-md',
                            'text-sm font-semibold text-white',
                            'transition-opacity duration-300 group-hover:opacity-95',
                            isBookingClosed
                                ? 'cursor-not-allowed bg-[#9AA3A8] opacity-80'
                                : HP_THEME_BTN_CLASS,
                        )}
                        style={isBookingClosed ? undefined : HP_THEME_BTN_STYLE}
                    >
                        {isBookingClosed ? 'Booking Closed' : bookLabel}
                    </span>
                </div>
            </div>
        </Link>
    )
}
