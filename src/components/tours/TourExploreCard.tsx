import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { tourDetailPath } from '@/services/tours/tours.utils'

type TourExploreCardProps = {
    slug: string
    discount: string
    title: string
    image: string
    detailHref?: string
}

export function TourExploreCard({
    slug,
    discount,
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

            {discount ? (
                <div className='absolute left-1/2 top-3 w-[calc(100%-1.5rem)] max-w-[356px] -translate-x-1/2 sm:top-4 lg:top-5'>
                    <span className='inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-[#276968] px-4 py-2 font-roboto text-xs font-medium leading-none text-white sm:min-h-[52px] sm:px-5 sm:text-sm lg:min-h-[64px] lg:px-6 lg:text-base'>
                        {discount}
                    </span>
                </div>
            ) : null}

            <div className='absolute inset-x-0 bottom-0 flex flex-col items-center px-3 pb-4 pt-12 text-center sm:px-4 sm:pb-5 sm:pt-14 lg:px-5 lg:pb-6 lg:pt-16'>
                <h3 className='font-jost text-[20px] font-medium uppercase leading-snug tracking-wide text-white'>
                    {title}
                </h3>
                <Link
                    href={detailHref ?? tourDetailPath(slug)}
                    className='mt-2 inline-flex items-center gap-1.5 font-roboto text-base font-normal text-white/95 transition-colors hover:text-white sm:mt-3'
                >
                    View All Place
                    <ArrowRight className='h-3.5 w-3.5 sm:h-4 sm:w-4' strokeWidth={2} aria-hidden />
                </Link>
            </div>
        </article>
    )
}
