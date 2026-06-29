'use client'

import { TourMediaImage } from '@/components/pages/tour/TourMediaImage'
import { HP_THEME_BTN_CLASS, HP_THEME_BTN_STYLE } from '@/data/homepage'
import { cn } from '@/lib/utils/clsxUtils'
import Link from 'next/link'

import { usePrefixedHref } from '@/hooks/useAgencyPreviewBase'
import { tourDetailPath } from '@/services/tours/tours.utils'

import { TourDiscountBadge } from './TourDiscountBadge'

type TourExploreCardProps = {
    slug: string
    discountPercent?: number | null
    title: string
    image: string
    detailHref?: string
    totalBooked?: number
    remainingSeats?: number | null
}

function formatRemainingSeats(remainingSeats: number | null | undefined): string {
    if (remainingSeats == null) return 'N/A'
    return String(remainingSeats)
}

export function TourExploreCard({
    slug,
    discountPercent,
    title,
    image,
    detailHref,
    totalBooked = 0,
    remainingSeats = null,
}: TourExploreCardProps) {
    const detailPath = usePrefixedHref(detailHref ?? tourDetailPath(slug)) ?? tourDetailPath(slug)

    return (
        <Link
            href={detailPath}
            aria-label={`Book now: ${title}`}
            className='group relative mx-auto block w-full max-w-[416px] overflow-hidden rounded-[10px] aspect-[416/300] min-h-[220px] transition-shadow duration-300 hover:shadow-[0_18px_40px_rgba(0,0,0,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:min-h-[260px] lg:mx-0 lg:min-h-[300px]'
        >
            <TourMediaImage
                src={image}
                alt=''
                fill
                className='object-cover transition-transform duration-500 group-hover:scale-[1.06]'
                sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 416px'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/15 transition-colors duration-300 group-hover:from-black/88 group-hover:via-black/45' />

            <TourDiscountBadge discountPercent={discountPercent} />

            <div className='absolute inset-x-0 bottom-0 flex flex-col items-center px-3 pb-4 pt-14 text-center sm:px-4 sm:pb-5 sm:pt-16 lg:px-5 lg:pb-6 lg:pt-[4.5rem]'>
                <h3 className='font-jost text-[18px] font-medium uppercase leading-snug tracking-wide text-white transition-transform duration-300 group-hover:-translate-y-0.5 sm:text-[20px]'>
                    {title}
                </h3>

                <div className='mt-3 inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full border border-white/20 bg-black/35 px-3 py-1.5 font-roboto text-[11px] text-white/95 backdrop-blur-sm transition-colors duration-300 group-hover:border-white/35 group-hover:bg-black/50 sm:gap-2.5 sm:px-4 sm:py-2 sm:text-xs'>
                    <span className='inline-flex items-center gap-1 whitespace-nowrap'>
                        <span className='font-semibold text-white'>{totalBooked}</span>
                        <span className='text-white/80'>booked</span>
                    </span>
                    <span className='h-3 w-px shrink-0 bg-white/35' aria-hidden />
                    <span className='inline-flex items-center gap-1 whitespace-nowrap'>
                        <span className='font-semibold text-white'>
                            {formatRemainingSeats(remainingSeats)}
                        </span>
                        <span className='text-white/80'>seats left</span>
                    </span>
                </div>

                <span
                    className={cn(
                        'mt-3 inline-flex h-10 min-w-[128px] items-center justify-center rounded-full px-5 text-sm font-semibold uppercase tracking-[0.1em] transition-transform duration-300 group-hover:scale-[1.02] sm:mt-4 sm:h-11 sm:min-w-[140px]',
                        HP_THEME_BTN_CLASS,
                    )}
                    style={HP_THEME_BTN_STYLE}
                >
                    Book Now
                </span>
            </div>
        </Link>
    )
}
