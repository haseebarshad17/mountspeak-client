'use client'

import { HP_THEME_BTN_CLASS, HP_THEME_BTN_STYLE, STATIC_UI_COLORS } from '@/data/homepage'
import { useQuery } from '@tanstack/react-query'

import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import { SectionEmptyState } from '@/components/ui/section-empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { TourExploreCard } from '@/components/tours/TourExploreCard'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import { useIsAgencySite } from '@/hooks/useIsAgencySite'
import { cn } from '@/lib/utils/clsxUtils'
import { DEMO_TOUR_DETAIL_PATH, DEMO_TOUR_LIST_ITEM } from '@/lib/tours/default-tour-page'
import { supabase } from '@/lib/supabase/supabase.client'
import { selectHomepageAgencyId } from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'
import { toursService } from '@/services/tours/tours.service'
import { mapTourRowsToListItems } from '@/services/tours/tour-seat-availability'
import { Compass } from 'lucide-react'

const HOMEPAGE_TOUR_LIMIT = 6

const ExploreTheWorld = ({ page }: HomepagePageProps) => {
    const section = page.sections.exploreTheWorld
    const isAgencySite = useIsAgencySite()
    const agencyId = useAppSelector(selectHomepageAgencyId)

    const { data: homepageTours, isLoading } = useQuery({
        queryKey: ['homepage-latest-tours', isAgencySite, agencyId],
        enabled: isAgencySite === true && !!agencyId,
        queryFn: async () => {
            const api = toursService({ supabase, agencyId: agencyId ?? undefined })
            const rows = await api.getLatestPublishedTours(HOMEPAGE_TOUR_LIMIT + 1)
            const hasMore = rows.length > HOMEPAGE_TOUR_LIMIT

            return {
                tours: mapTourRowsToListItems(rows.slice(0, HOMEPAGE_TOUR_LIMIT)),
                hasMore,
            }
        },
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
                    <SectionEyebrow name={section.eyebrow} />
                    <h2
                        id='explore-the-world-heading'
                        className='agency-section-heading pt-2 text-[28px] font-medium leading-tight sm:pt-3 sm:text-[34px] sm:leading-[40px] lg:pt-4 lg:text-[40px] lg:leading-[48px]'
                        style={{ color: STATIC_UI_COLORS.title, fontFamily: 'var(--hp-font-heading)' }}
                    >
                        {section.title}
                    </h2>
                    <p
                        className='mx-auto max-w-[861px] pt-3 text-sm font-normal leading-6 sm:pt-4 sm:text-base sm:leading-6 md:pt-5 md:text-lg md:leading-6'
                        style={{ color: STATIC_UI_COLORS.textMuted, fontFamily: 'var(--hp-font-body)' }}
                    >
                        {section.paragraph}
                    </p>
                </header>

                {showLoading ? (
                    <div
                        className='grid grid-cols-1 justify-items-center gap-4 pt-8 xs:gap-5 sm:grid-cols-2 sm:gap-6 sm:pt-10 md:pt-12 lg:grid-cols-3 lg:justify-items-stretch lg:gap-6 lg:pt-14'
                        aria-busy='true'
                        aria-label='Loading tours'
                    >
                        {Array.from({ length: HOMEPAGE_TOUR_LIMIT }).map((_, index) => (
                            <Skeleton
                                key={index}
                                className='aspect-[416/300] w-full max-w-[416px] rounded-[10px] lg:max-w-none'
                            />
                        ))}
                    </div>
                ) : displayTours.length > 0 ? (
                    <>
                        <div className='grid grid-cols-1 justify-items-center gap-4 pt-8 xs:gap-5 sm:grid-cols-2 sm:gap-6 sm:pt-10 md:pt-12 lg:grid-cols-3 lg:justify-items-stretch lg:gap-6 lg:pt-14'>
                            {displayTours.map((tour) => (
                                <TourExploreCard
                                    key={tour.id}
                                    slug={tour.slug}
                                    discountPercent={tour.discountPercent}
                                    title={tour.title}
                                    image={tour.image}
                                    totalBooked={tour.totalBooked}
                                    remainingSeats={tour.remainingSeats}
                                    detailHref={
                                        isAgencySite === false ? DEMO_TOUR_DETAIL_PATH : undefined
                                    }
                                />
                            ))}
                        </div>

                        {showViewAllButton ? (
                            <div className='mt-8 flex justify-center sm:mt-10'>
                                <Button
                                    variant='default'
                                    href='/search'
                                    style={HP_THEME_BTN_STYLE}
                                    className={cn('w-max min-w-[140px]', HP_THEME_BTN_CLASS)}
                                >
                                    View All Tours
                                </Button>
                            </div>
                        ) : null}
                    </>
                ) : (
                    <div className='pt-8 sm:pt-10 md:pt-12 lg:pt-14'>
                        <SectionEmptyState
                            icon={Compass}
                            title='No tours yet'
                            description={section.emptyMessage}
                        />
                    </div>
                )}
            </div>
        </section>
    )
}

export default ExploreTheWorld
