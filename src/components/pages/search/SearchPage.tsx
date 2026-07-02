'use client'

import { Compass, SearchX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import HeroFilters from '@/components/pages/marketing/home/HeroFilters'
import { PageHeroBanner, PAGE_HERO_CONTENT_CLASS } from '@/components/ui/page-hero-banner'
import { SectionEmptyState } from '@/components/ui/section-empty-state'
import { TourExploreCard } from '@/components/tours/TourExploreCard'
import { STATIC_UI_COLORS } from '@/data/homepage'
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
                bannerClassName='h-auto sm:min-h-[400px]'
                className='px-2 pt-2 pb-0 sm:px-3 sm:pt-3 md:px-4 md:pt-4 lg:px-5 lg:pt-5'
            >
                <div
                    className={cn(
                        PAGE_HERO_CONTENT_CLASS,
                        'h-auto justify-start gap-5 pb-8 sm:gap-6 sm:pb-10',
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

            <main className='pb-12 pt-8 sm:pb-20 sm:pt-12 lg:pt-16'>
                <div className='agency-container'>
                    <header className='mx-auto max-w-[900px] text-center'>
                        <h2
                            className='agency-section-heading text-[#14141F]'
                            style={{ fontFamily: 'var(--hp-font-heading)' }}
                        >
                            Search results
                        </h2>
                        <p
                            className='mx-auto mt-3 max-w-2xl text-sm font-normal leading-6 sm:mt-4 sm:text-base'
                            style={{ color: STATIC_UI_COLORS.textMuted, fontFamily: 'var(--hp-font-body)' }}
                        >
                            {summary
                                ? summary
                                : isUmrahSearch
                                  ? 'Explore available Umrah packages and pick the one that suits you.'
                                  : 'Explore available trips and pick your next adventure.'}
                        </p>
                        {isFiltered ? (
                            <p
                                className='mt-2 text-sm text-[#707979]'
                                style={{ fontFamily: 'var(--hp-font-body)' }}
                            >
                                {tours.length} trip{tours.length === 1 ? '' : 's'} found
                            </p>
                        ) : null}
                    </header>

                    {tours.length > 0 ? (
                        <>
                            <div className='mt-6 grid grid-cols-1 justify-items-center gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-6 lg:mt-10 lg:grid-cols-3 lg:justify-items-stretch lg:gap-6'>
                                {visibleTours.map((tour) => (
                                    <TourExploreCard
                                        key={tour.id}
                                        slug={tour.slug}
                                        discountPercent={tour.discountPercent}
                                        pricePerSeat={tour.pricePerSeat}
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
                                    className='flex justify-center pt-6 sm:pt-8'
                                    aria-hidden
                                >
                                    <span className='text-sm text-[#707979]'>Loading more trips...</span>
                                </div>
                            ) : null}
                        </>
                    ) : (
                        <div className='mt-6 sm:mt-8'>
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
