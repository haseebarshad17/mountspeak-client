'use client'

import { HP_THEME_LINK_CLASS, STATIC_UI_COLORS } from '@/data/homepage'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import { SectionEmptyState } from '@/components/ui/section-empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { PrefixedLink } from '@/components/ui/prefixed-link'
import { TourExploreCard } from '@/components/tours/TourExploreCard'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import { useIsAgencySite } from '@/hooks/useIsAgencySite'
import { useSiteListingCopy } from '@/hooks/useTourOrPackageCopy'
import { cn } from '@/lib/utils/clsxUtils'
import { DEMO_TOUR_DETAIL_PATH, DEMO_TOUR_LIST_ITEM } from '@/lib/tours/default-tour-page'
import {
    adaptTourCopyForUmrah,
    type ListingKind,
} from '@/lib/homepage/specialization'
import { supabase } from '@/lib/supabase/supabase.client'
import { selectHomepageAgencyId } from '@/store/homepage/homepage.selectors'
import { listingDetailPath } from '@/services/tours/tours.utils'
import { internationalTourService } from '@/services/international-tour/international-tour.service'
import { mapInternationalTourRowsToListItems } from '@/services/international-tour/international-tour.utils'
import { useAppSelector } from '@/store/hooks'
import { toursService } from '@/services/tours/tours.service'
import { mapTourRowsToListItemsWithSlots } from '@/services/tours/tour-seat-availability'
import { umrahPlanService } from '@/services/umrah-plan/umrah-plan.service'
import { mapUmrahPlanRowsToListItems } from '@/services/umrah-plan/umrah-plan.utils'
import { Compass, ArrowRightIcon } from 'lucide-react'

const HOMEPAGE_TOUR_LIMIT = 6

async function fetchLatestListings(agencyId: string, kind: ListingKind) {
    if (kind === 'umrah') {
        const api = umrahPlanService({ supabase, agencyId })
        const rows = await api.getLatestPublishedPlans(HOMEPAGE_TOUR_LIMIT + 1)
        return {
            tours: mapUmrahPlanRowsToListItems(rows.slice(0, HOMEPAGE_TOUR_LIMIT)),
            hasMore: rows.length > HOMEPAGE_TOUR_LIMIT,
        }
    }

    if (kind === 'international') {
        const api = internationalTourService({ supabase, agencyId })
        const rows = await api.getLatestPublishedPlans(HOMEPAGE_TOUR_LIMIT + 1)
        return {
            tours: mapInternationalTourRowsToListItems(rows.slice(0, HOMEPAGE_TOUR_LIMIT)),
            hasMore: rows.length > HOMEPAGE_TOUR_LIMIT,
        }
    }

    const api = toursService({ supabase, agencyId })
    const rows = await api.getLatestPublishedTours(HOMEPAGE_TOUR_LIMIT + 1)
    return {
        tours: await mapTourRowsToListItemsWithSlots(supabase, rows.slice(0, HOMEPAGE_TOUR_LIMIT)),
        hasMore: rows.length > HOMEPAGE_TOUR_LIMIT,
    }
}

const ExploreTheWorld = ({ page }: HomepagePageProps) => {
    const section = page.sections.exploreTheWorld
    const isAgencySite = useIsAgencySite()
    const agencyId = useAppSelector(selectHomepageAgencyId)
    const {
        isMultiSpec,
        isUmrahSite,
        ownedKinds,
        copy: defaultCopy,
    } = useSiteListingCopy()
    const [activeKind, setActiveKind] = useState<ListingKind>(ownedKinds[0] ?? 'tour')
    const listingKind = isMultiSpec ? activeKind : (ownedKinds[0] ?? 'tour')
    const isPackageListing = listingKind === 'umrah' || listingKind === 'international'
    const listingCopy = isMultiSpec
        ? {
              ...defaultCopy,
              viewAllLabel:
                  listingKind === 'umrah'
                      ? 'View all Umrah packages'
                      : listingKind === 'international'
                        ? 'View all international tours'
                        : 'View all tours',
              bookLabel: listingKind === 'tour' ? 'Book Tour' : 'View details',
          }
        : defaultCopy

    const eyebrow = isMultiSpec ? section.eyebrow : adaptTourCopyForUmrah(section.eyebrow, isUmrahSite)
    const title = isMultiSpec ? section.title : adaptTourCopyForUmrah(section.title, isUmrahSite)
    const paragraph = isMultiSpec ? section.paragraph : adaptTourCopyForUmrah(section.paragraph, isUmrahSite)
    const emptyMessage = isMultiSpec ? section.emptyMessage : adaptTourCopyForUmrah(section.emptyMessage, isUmrahSite)

    const { data: homepageTours, isLoading } = useQuery({
        queryKey: ['homepage-latest-tours', isAgencySite, agencyId, listingKind],
        enabled: isAgencySite === true && !!agencyId,
        queryFn: () => fetchLatestListings(agencyId!, listingKind),
        staleTime: 60_000,
    })

    const displayTours = isAgencySite === false ? [DEMO_TOUR_LIST_ITEM] : (homepageTours?.tours ?? [])
    const showLoading = isAgencySite === null || (isAgencySite === true && isLoading)
    const showViewAllButton = isAgencySite === false ? false : (homepageTours?.hasMore ?? false)

    return (
        <section
            className='overflow-hidden bg-white'
            aria-labelledby='explore-the-world-heading'
        >
            <div className='agency-container'>
                <header className='mx-auto max-w-[900px] px-1 text-center sm:px-0'>
                    <SectionEyebrow name={eyebrow} />
                    <h2
                        id='explore-the-world-heading'
                        className='agency-section-heading pt-2 text-[28px] font-medium leading-tight sm:pt-3 sm:text-[34px] sm:leading-[40px] lg:pt-4 lg:text-[40px] lg:leading-[48px]'
                        style={{ color: STATIC_UI_COLORS.title, fontFamily: 'var(--hp-font-heading)' }}
                    >
                        {title}
                    </h2>
                    <p
                        className='mx-auto max-w-[861px] pt-3 text-sm font-normal leading-6 sm:pt-4 sm:text-base sm:leading-6 md:pt-5 md:text-lg md:leading-6'
                        style={{ color: STATIC_UI_COLORS.textMuted, fontFamily: 'var(--hp-font-body)' }}
                    >
                        {paragraph}
                    </p>
                </header>

                {isMultiSpec && ownedKinds.length > 1 ? (
                    <div className='pt-8 sm:pt-10'>
                        <div className='flex flex-wrap items-center justify-center gap-2'>
                            {ownedKinds.map((kind) => (
                                <button
                                    key={kind}
                                    type='button'
                                    onClick={() => setActiveKind(kind)}
                                    className={cn(
                                        'rounded-full px-4 py-2 text-sm font-medium transition',
                                        kind === activeKind
                                            ? 'bg-[#064045] text-white shadow-sm'
                                            : 'border border-[#D6D9DC] bg-white text-[#404849] hover:border-[#064045]/40',
                                    )}
                                >
                                    {kind === 'tour'
                                        ? 'Tours'
                                        : kind === 'umrah'
                                          ? 'Umrah'
                                          : 'International'}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : null}

                {showLoading ? (
                    <div
                        className='grid grid-cols-1 justify-items-center gap-4 pt-8 xs:gap-5 sm:grid-cols-2 sm:gap-6 sm:pt-10 md:pt-12 lg:grid-cols-3 lg:justify-items-stretch lg:gap-6 lg:pt-14'
                        aria-busy='true'
                        aria-label={listingCopy.loadingLabel}
                    >
                        {Array.from({ length: HOMEPAGE_TOUR_LIMIT }).map((_, index) => (
                            <Skeleton
                                key={index}
                                className='aspect-[16/10] w-full max-w-[416px] rounded-xl lg:max-w-none'
                            />
                        ))}
                    </div>
                ) : displayTours.length > 0 ? (
                    <>
                        <div className='grid grid-cols-1 justify-items-center gap-4 pt-8 xs:gap-5 sm:grid-cols-2 sm:gap-6 sm:pt-10 md:pt-12 lg:grid-cols-3 lg:justify-items-stretch lg:gap-6 lg:pt-14'>
                            {displayTours.map((tour) => (
                                <TourExploreCard
                                    key={tour.id}
                                    tourId={isAgencySite === false ? undefined : tour.id}
                                    listingKind={tour.listingKind}
                                    slug={tour.slug}
                                    discountPercent={tour.discountPercent}
                                    pricePerSeat={tour.pricePerSeat}
                                    title={tour.title}
                                    category={isPackageListing ? null : tour.category}
                                    image={tour.image}
                                    totalBooked={tour.totalBooked}
                                    remainingSeats={tour.remainingSeats}
                                    daysLeft={tour.daysLeft}
                                    departureDate={tour.departureDate}
                                    departureSlots={tour.departureSlots}
                                    bookLabel={listingCopy.bookLabel}
                                    isBookingClosed={tour.isBookingClosed}
                                    detailHref={
                                        isAgencySite === false
                                            ? DEMO_TOUR_DETAIL_PATH
                                            : listingDetailPath(tour)
                                    }
                                />
                            ))}
                        </div>

                        {showViewAllButton ? (
                            <div className='mt-8 flex justify-center sm:mt-10'>
                                <PrefixedLink
                                    href={
                                        listingKind === 'tour'
                                            ? '/search'
                                            : `/search?type=${listingKind}`
                                    }
                                    className={cn(
                                        HP_THEME_LINK_CLASS,
                                        'flex items-center text-sm font-semibold underline underline-offset-4 sm:text-base',
                                    )}
                                >
                                    {listingCopy.viewAllLabel}
                                    <ArrowRightIcon className='size-4 inline-block ml-2' aria-hidden />
                                </PrefixedLink>
                            </div>
                        ) : null}
                    </>
                ) : (
                    <div className='pt-8 sm:pt-10 md:pt-12 lg:pt-14'>
                        <SectionEmptyState
                            icon={Compass}
                            title={listingCopy.emptyTitle}
                            description={listingCopy.emptyHomeDescription ?? emptyMessage}
                        />
                    </div>
                )}
            </div>
        </section>
    )
}

export default ExploreTheWorld
