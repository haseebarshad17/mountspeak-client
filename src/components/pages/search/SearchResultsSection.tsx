'use client'

import { Compass, SearchX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { SectionEmptyState } from '@/components/ui/section-empty-state'
import { TourExploreCard } from '@/components/tours/TourExploreCard'
import { getTourOrPackageCopy, listingUsesPackageCopy, type ListingKind } from '@/lib/homepage/specialization'
import {
    selectHomepageAgencySpecializationIds,
    selectHomepageSpecializationId,
    selectHomepageSpecializations,
} from '@/store/homepage/homepage.selectors'
import { listingDetailPath } from '@/services/tours/tours.utils'
import { useAppSelector } from '@/store/hooks'
import type { TourSearchFilters } from '@/services/tours/tours.search.types'
import { hasTourSearchFilters } from '@/services/tours/tours.search.utils'
import {
    hasUmrahSearchFilters,
    type UmrahSearchFilters,
} from '@/services/tours/tours.umrah-search.utils'
import type { TourListItem } from '@/services/tours/tours.types'

const TOURS_PER_SCROLL = 6

type SearchResultsSectionProps = {
    tours: TourListItem[]
    filters: TourSearchFilters
    umrahFilters: UmrahSearchFilters
    listingType: ListingKind
}

export function SearchResultsSection({
    tours,
    filters,
    umrahFilters,
    listingType,
}: SearchResultsSectionProps) {
    const specializationId = useAppSelector(selectHomepageSpecializationId)
    const agencySpecializationIds = useAppSelector(selectHomepageAgencySpecializationIds)
    const specializations = useAppSelector(selectHomepageSpecializations)
    const usesPackageCopy = listingUsesPackageCopy(
        listingType,
        specializationId,
        agencySpecializationIds,
        specializations,
    )
    const listingCopy = getTourOrPackageCopy(usesPackageCopy)
    const isPackageSearch = listingType === 'umrah' || listingType === 'international'
    const isFiltered = isPackageSearch
        ? hasUmrahSearchFilters(umrahFilters)
        : hasTourSearchFilters(filters)

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

    if (tours.length > 0) {
        return (
            <>
                {isFiltered ? (
                    <p
                        className='mx-auto mt-2 max-w-[900px] text-center text-sm text-[#707979]'
                        style={{ fontFamily: 'var(--hp-font-body)' }}
                    >
                        {listingCopy.resultsCountLabel(tours.length)}
                    </p>
                ) : null}

                <div className='mt-6 grid grid-cols-1 justify-items-center gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-6 lg:mt-10 lg:grid-cols-3 lg:justify-items-stretch lg:gap-6'>
                    {visibleTours.map((tour) => (
                        <TourExploreCard
                            key={tour.id}
                            tourId={tour.id}
                            listingKind={tour.listingKind}
                            slug={tour.slug}
                            discountPercent={tour.discountPercent}
                            pricePerSeat={tour.pricePerSeat}
                            title={tour.title}
                            category={isPackageSearch ? null : tour.category}
                            image={tour.image}
                            totalBooked={tour.totalBooked}
                            remainingSeats={tour.remainingSeats}
                            daysLeft={tour.daysLeft}
                            departureDate={tour.departureDate}
                            departureSlots={tour.departureSlots}
                            bookLabel={listingCopy.bookLabel}
                            isBookingClosed={tour.isBookingClosed}
                            detailHref={listingDetailPath(tour)}
                        />
                    ))}
                </div>

                {hasMoreTours ? (
                    <div
                        ref={loadMoreRef}
                        className='flex justify-center pt-6 sm:pt-8'
                        aria-hidden
                    >
                        <span className='text-sm text-[#707979]'>
                            {isPackageSearch ? 'Loading more packages...' : 'Loading more trips...'}
                        </span>
                    </div>
                ) : null}
            </>
        )
    }

    return (
        <div className='mt-6 sm:mt-8'>
            <SectionEmptyState
                icon={isFiltered ? SearchX : Compass}
                title={
                    isFiltered
                        ? isPackageSearch
                            ? 'No packages found'
                            : 'No results found'
                        : listingCopy.emptyPublishedTitle
                }
                description={
                    isFiltered
                        ? isPackageSearch
                            ? listingType === 'international'
                                ? 'No international tours match your search. Try different duration or package type.'
                                : 'No Umrah packages match your search. Try different duration or package type.'
                            : 'No trips match your search. Try different locations or dates.'
                        : listingCopy.emptyPublishedDescription
                }
            />
        </div>
    )
}
