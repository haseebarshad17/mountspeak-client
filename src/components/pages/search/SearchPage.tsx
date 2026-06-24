'use client'

import { Compass, SearchX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import HeroFilters from '@/components/pages/marketing/home/HeroFilters'
import { PageHeroBanner, PAGE_HERO_CONTENT_CLASS } from '@/components/ui/page-hero-banner'
import { SectionEmptyState } from '@/components/ui/section-empty-state'
import { TourExploreCard } from '@/components/tours/TourExploreCard'
import { useHeroBackgroundImage } from '@/hooks/useHeroBackgroundImage'
import { useHomepagePageWithFallback } from '@/hooks/useHomepagePageWithFallback'
import { usesHajjUmrahBanner } from '@/lib/homepage/specialization'
import { cn } from '@/lib/utils/clsxUtils'
import {
    selectHomepageSpecializationId,
    selectHomepageSpecializations,
} from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'
import type { TourSearchFilters } from '@/services/tours/tours.search.types'
import { formatTourSearchSummary, hasTourSearchFilters } from '@/services/tours/tours.search.utils'
import {
    formatUmrahSearchSummary,
    hasUmrahSearchFilters,
    type UmrahSearchFilters,
} from '@/services/tours/tours.umrah-search.utils'
import type { TourListItem } from '@/services/tours/tours.types'

const TOURS_PER_SCROLL = 6

type SearchPageProps = {
    tours: TourListItem[]
    filters: TourSearchFilters
    umrahFilters: UmrahSearchFilters
    tourLocations: string[]
}

export default function SearchPage({ tours, filters, umrahFilters, tourLocations }: SearchPageProps) {
    const page = useHomepagePageWithFallback()
    const specializationId = useAppSelector(selectHomepageSpecializationId)
    const specializations = useAppSelector(selectHomepageSpecializations)
    const isUmrahSearch = usesHajjUmrahBanner(specializationId, specializations)
    const backgroundImage = useHeroBackgroundImage()
    const [visibleCount, setVisibleCount] = useState(TOURS_PER_SCROLL)
    const loadMoreRef = useRef<HTMLDivElement>(null)

    const visibleTours = tours.slice(0, visibleCount)
    const hasMoreTours = visibleCount < tours.length

    useEffect(() => {
        setVisibleCount(TOURS_PER_SCROLL)
    }, [tours])

    useEffect(() => {
        if (!hasMoreTours) return

        const sentinel = loadMoreRef.current
        if (!sentinel) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setVisibleCount((current) => Math.min(current + TOURS_PER_SCROLL, tours.length))
                }
            },
            { rootMargin: '200px 0px' },
        )

        observer.observe(sentinel)

        return () => observer.disconnect()
    }, [hasMoreTours, tours.length])

    const summary = isUmrahSearch
        ? formatUmrahSearchSummary(umrahFilters)
        : formatTourSearchSummary(filters)
    const isFiltered = isUmrahSearch ? hasUmrahSearchFilters(umrahFilters) : hasTourSearchFilters(filters)

    const heroCopy = isUmrahSearch
        ? {
              title: 'Find your Umrah package',
              description:
                  'Select package duration, number of passengers, and package type to browse available Umrah tours.',
          }
        : {
              title: 'Find your trip',
              description:
                  'Choose your route and travel dates to browse published tours from our partners.',
          }

    return (
        <>
            <PageHeroBanner
                backgroundImage={backgroundImage}
                bannerClassName='h-auto sm:h-[400px]'
                className='pt-4'
            >
                    <div
                        className={cn(
                            PAGE_HERO_CONTENT_CLASS,
                            'h-auto pt-[120px] sm:h-full sm:pt-[108px] justify-start gap-6 pb-8 sm:gap-8 sm:pb-10',
                        )}
                    >
                        <div>
                            <h1 className='text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl xl:text-[45px]'>
                                {heroCopy.title}
                            </h1>
                            <p className='mx-auto mt-4 max-w-[640px] text-sm leading-6 text-white/90 sm:text-base xl:text-lg'>
                                {heroCopy.description}
                            </p>
                        </div>

                        <div className='mx-auto w-full max-w-[867px]'>
                            <HeroFilters
                                page={page ?? undefined}
                                initialValues={filters}
                                umrahInitialValues={umrahFilters}
                                tourLocations={tourLocations}
                            />
                        </div>
                    </div>
            </PageHeroBanner>

            <main className='pb-20 pt-16 sm:pt-20 lg:pt-[100px]'>
                <div className='agency-container'>
                    <div className='mx-auto max-w-[900px] text-center'>
                        <h2 className='text-[32px] font-medium leading-tight text-[#14141F] sm:text-[40px]'>
                            Search results
                        </h2>
                        <p className='pt-3 text-base text-neutral-600'>
                            {summary
                                ? summary
                                : isUmrahSearch
                                  ? 'Explore available Umrah packages and pick the one that suits you.'
                                  : 'Explore available trips and pick your next adventure.'}
                        </p>
                        {isFiltered ? (
                            <p className='pt-2 text-sm text-neutral-500'>
                                {tours.length} trip{tours.length === 1 ? '' : 's'} found
                            </p>
                        ) : null}
                    </div>

                    {tours.length > 0 ? (
                        <>
                            <div className='grid grid-cols-1 justify-items-center gap-5 pt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:justify-items-stretch'>
                                {visibleTours.map((tour) => (
                                    <TourExploreCard
                                        key={tour.id}
                                        slug={tour.slug}
                                        discountPercent={tour.discountPercent}
                                        title={tour.title}
                                        image={tour.image}
                                        totalBooked={tour.totalBooked}
                                        remainingSeats={tour.remainingSeats}
                                    />
                                ))}
                            </div>

                            {hasMoreTours ? (
                                <div
                                    ref={loadMoreRef}
                                    className='flex justify-center pt-8'
                                    aria-hidden
                                >
                                    <span className='text-sm text-neutral-500'>Loading more trips...</span>
                                </div>
                            ) : null}
                        </>
                    ) : (
                        <div className='pt-8 sm:pt-10'>
                            <SectionEmptyState
                                icon={isFiltered ? SearchX : Compass}
                                title={
                                    isFiltered
                                        ? isUmrahSearch
                                            ? 'No packages found'
                                            : 'No results found'
                                        : 'No tours published yet'
                                }
                                description={
                                    isFiltered
                                        ? isUmrahSearch
                                            ? 'No Umrah packages match your search. Try different duration or package type.'
                                            : 'No trips match your search. Try different locations or dates.'
                                        : 'No published tours yet. Check back soon for new adventures.'
                                }
                            />
                        </div>
                    )}
                </div>
            </main>
        </>
    )
}
