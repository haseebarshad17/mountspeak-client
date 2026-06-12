import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { tourDetailPath } from '@/services/tours/tours.utils'

import { TourDiscountBadge } from './TourDiscountBadge'

type TourExploreCardProps = {
    slug: string
    discountPercent?: number | null
    title: string
    image: string
    detailHref?: string
}

export function TourExploreCard({
    slug,
    discountPercent,
    title,
    image,
    detailHref,
}: TourExploreCardProps) {
    return (
        <article className='group relative mx-auto w-full max-w-[416px] overflow-hidden rounded-[10px] aspect-[416/300] min-h-[220px] sm:min-h-[260px] lg:mx-0 lg:min-h-[300px]'>
            <Image
                src={image}
                alt={title}
                fill
                className='object-cover'
                sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 416px'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10' />

            <TourDiscountBadge discountPercent={discountPercent} />

            <div className='absolute inset-x-0 bottom-0 flex flex-col items-center px-3 pb-4 pt-12 text-center sm:px-4 sm:pb-5 sm:pt-14 lg:px-5 lg:pb-6 lg:pt-16'>
                <h3 className='font-jost text-[20px] font-medium uppercase leading-snug tracking-wide text-white'>
                    {title}
                </h3>
                <Link
                    href={detailHref ?? tourDetailPath(slug)}
                    className='mt-2 !inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-roboto text-base font-normal text-white/95 transition-colors hover:text-white sm:mt-3'
                >
                    View All Place
                    <ArrowRight
                        className='h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4'
                        strokeWidth={2}
                        aria-hidden
                    />
                </Link>
            </div>
        </article>
    )
}
