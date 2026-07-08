'use client'

import { TourMediaImage } from '@/components/pages/tour/TourMediaImage'
import { HP_THEME_BTN_CLASS, HP_THEME_BTN_STYLE } from '@/data/homepage'
import { DEMO_TOUR_DETAIL_PATH } from '@/lib/tours/default-tour-page'
import { cn } from '@/lib/utils/clsxUtils'
import Link from 'next/link'

import { usePrefixedHref } from '@/hooks/useAgencyPreviewBase'
import {
    formatTourDaysLeft,
    formatTourPrice,
    getTourDiscountedPricePerSeat,
    tourDetailPath,
} from '@/services/tours/tours.utils'

import { TourDiscountBadge } from './TourDiscountBadge'

type TourExploreCardProps = {
    slug: string
    discountPercent?: number | null
    pricePerSeat?: number | null
    title: string
    image: string
    detailHref?: string
    totalBooked?: number
    remainingSeats?: number | null
    daysLeft?: number | null
    departureDate?: string | null
    bookLabel?: string
}

function formatRemainingSeats(remainingSeats: number | null | undefined): string {
    if (remainingSeats == null) return 'N/A'
    return String(remainingSeats)
}

export function TourExploreCard({
    slug,
    discountPercent,
    pricePerSeat = null,
    title,
    image,
    detailHref,
    totalBooked = 0,
    remainingSeats = null,
    daysLeft = null,
    departureDate = null,
    bookLabel = 'Book Tour',
}: TourExploreCardProps) {
    const rawDetailPath = detailHref ?? tourDetailPath(slug)
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
    const daysLeftLabel = formatTourDaysLeft(daysLeft, departureDate)

    return (
        <Link
            href={detailPath}
            aria-label={`View tour: ${title}`}
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

                <TourDiscountBadge discountPercent={discountPercent} />
            </div>

            <div className='flex flex-1 flex-col px-3.5 py-3 sm:px-4 sm:py-3.5'>
                <h3 className='line-clamp-2 font-jost text-[15px] font-semibold leading-5 text-[#14141F] transition-colors group-hover:text-[var(--hp-color-primary)] sm:text-base'>
                    {title}
                </h3>

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
                    <span className='font-medium text-[#404849]'>
                        {formatRemainingSeats(remainingSeats)}
                    </span>{' '}
                    seats left
                </p>

                <div className='mt-3 flex flex-1 flex-col border-t border-[#e0e1e2] pt-3'>
                    {hasPrice && discountedPrice != null ? (
                        <div>
                            <div className='mt-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5'>
                                {showOriginalPrice ? (
                                    <span
                                        className='text-[13px] font-medium text-[#9AA3A8] line-through decoration-[#9AA3A8] decoration-1'
                                        aria-label={`Original price ${formatTourPrice(pricePerSeat)}`}
                                    >
                                        {formatTourPrice(pricePerSeat)}
                                    </span>
                                ) : null}
                                <span className='font-jost text-lg font-bold leading-none tracking-tight text-[#012b32] tabular-nums sm:text-xl'>
                                    {formatTourPrice(discountedPrice)}
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
                            HP_THEME_BTN_CLASS,
                        )}
                        style={HP_THEME_BTN_STYLE}
                    >
                        {bookLabel}
                    </span>
                </div>
            </div>
        </Link>
    )
}
