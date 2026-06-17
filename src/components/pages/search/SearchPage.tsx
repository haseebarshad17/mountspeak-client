'use client'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import HeroFilters from '@/components/pages/marketing/home/HeroFilters'
import { TourDiscountBadge } from '@/components/tours/TourDiscountBadge'
import { usePrefixedHref } from '@/hooks/useAgencyPreviewBase'
import type { TourSearchFilters } from '@/services/tours/tours.search.types'
import { formatTourSearchSummary, hasTourSearchFilters } from '@/services/tours/tours.search.utils'
import type { TourListItem } from '@/services/tours/tours.types'
import { tourDetailPath } from '@/services/tours/tours.utils'

type SearchPageProps = {
    tours: TourListItem[]
    filters: TourSearchFilters
    tourLocations: string[]
}

function SearchResultCard({
    discountPercent,
    title,
    image,
    slug,
}: {
    discountPercent: number | null
    title: string
    image: string
    slug: string
}) {
    const detailPath = usePrefixedHref(tourDetailPath(slug)) ?? tourDetailPath(slug)

    return (
        <article className='group relative mx-auto w-full max-w-[416px] min-h-[240px] overflow-hidden rounded-[10px] lg:mx-0 lg:min-h-[300px]'>
            <Image
                src={image}
                alt={title}
                fill
                className='object-cover'
                sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 416px'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10' />

            <TourDiscountBadge discountPercent={discountPercent} />

            <div className='absolute inset-x-0 bottom-0 flex flex-col items-center px-4 pb-5 pt-14 text-center'>
                <h3 className='font-jost text-[20px] font-medium uppercase leading-snug tracking-wide text-white'>
                    {title}
                </h3>
                <Link
                    href={detailPath}
                    className='mt-3 !inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-roboto text-base font-normal text-white/95 transition-colors hover:text-white'
                >
                    View Details
                    <ArrowRight className='h-4 w-4 shrink-0' strokeWidth={2} aria-hidden />
                </Link>
            </div>
        </article>
    )
}

export default function SearchPage({ tours, filters, tourLocations }: SearchPageProps) {
    const summary = formatTourSearchSummary(filters)
    const isFiltered = hasTourSearchFilters(filters)

    return (
        <>
            <section className='p-2 sm:p-3 md:p-4 lg:p-5'>
                <div className='rounded-[16px] bg-[url("/images/pages/home/tour-list.png")] bg-cover bg-center bg-no-repeat'>
                    <div className='px-4 pb-8 pt-[120px] text-center text-white sm:px-6 sm:pb-10 sm:pt-36 md:pb-12 md:pt-44 lg:pb-14 lg:pt-48'>
                        <p
                            className='text-xs font-semibold uppercase tracking-[0.6px] text-white/80'
                        >
                            Search
                        </p>
                        <h1
                            className='mt-3 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl xl:text-[45px]'
                        >
                            Find your trip
                        </h1>
                        <p
                            className='mx-auto mt-4 max-w-[640px] text-sm leading-7 text-white/90 sm:text-base xl:text-lg'
                        >
                            Choose your route and travel dates to browse published tours from our partners.
                        </p>
                    </div>

                    <div className='px-4 pb-10 sm:px-6 sm:pb-12 md:pb-14 lg:pb-16'>
                        <div className='mx-auto w-full max-w-[867px]'>
                            <HeroFilters
                                initialValues={filters}
                                tourLocations={tourLocations}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <main className='bg-[#F7F8FA] pb-20 pt-4 sm:pt-6'>
                <div className='agency-container'>
                    <div className='mx-auto max-w-[900px] text-center'>
                        <h2
                            className='text-[32px] font-medium leading-tight text-[#14141F] sm:text-[40px]'
                        >
                            Search results
                        </h2>
                        <p
                            className='pt-3 text-base text-neutral-600'
                        >
                            {summary
                                ? summary
                                : 'Explore available trips and pick your next adventure.'}
                        </p>
                        {isFiltered ? (
                            <p
                                className='pt-2 text-sm text-neutral-500'
                            >
                                {tours.length} trip{tours.length === 1 ? '' : 's'} found
                            </p>
                        ) : null}
                    </div>

                    {tours.length > 0 ? (
                        <div className='grid grid-cols-1 justify-items-center gap-5 pt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:justify-items-stretch'>
                            {tours.map((tour) => (
                                <SearchResultCard
                                    key={tour.id}
                                    slug={tour.slug}
                                    discountPercent={tour.discountPercent}
                                    title={tour.title}
                                    image={tour.image}
                                />
                            ))}
                        </div>
                    ) : (
                        <p
                            className='mx-auto max-w-xl pt-10 text-center text-base text-neutral-500'
                        >
                            {isFiltered
                                ? 'No trips match your search. Try different locations or dates.'
                                : 'No published tours yet.'}
                        </p>
                    )}
                </div>
            </main>
        </>
    )
}
