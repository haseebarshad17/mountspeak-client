'use client'

import { useQuery } from '@tanstack/react-query'

import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import { TourExploreCard } from '@/components/tours/TourExploreCard'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import { useIsAgencySite } from '@/hooks/useIsAgencySite'
import { DEMO_TOUR_DETAIL_PATH, DEMO_TOUR_LIST_ITEM } from '@/lib/tours/default-tour-page'
import { supabase } from '@/lib/supabase/supabase.client'
import { selectHomepageAgencyId } from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'
import { toursService } from '@/services/tours/tours.service'
import { toTourListItem } from '@/services/tours/tours.utils'

const ExploreTheWorld = ({ page }: HomepagePageProps) => {
    const section = page.sections.exploreTheWorld
    const { colors } = page.theme
    const isAgencySite = useIsAgencySite()
    const agencyId = useAppSelector(selectHomepageAgencyId)

    const { data: tours = [], isLoading } = useQuery({
        queryKey: ['published-tours', isAgencySite, agencyId],
        enabled: isAgencySite === true && !!agencyId,
        queryFn: async () => {
            const api = toursService({ supabase, agencyId: agencyId ?? undefined })
            const rows = await api.getPublishedTours()
            return rows.map(toTourListItem)
        },
        staleTime: 60_000,
    })

    const displayTours = isAgencySite === false ? [DEMO_TOUR_LIST_ITEM] : tours
    const showLoading = isAgencySite === null || (isAgencySite === true && isLoading)

    return (
        <section
            className='overflow-hidden bg-white'
            aria-labelledby='explore-the-world-heading'
        >
            <div className='agency-container'>
                <header className='mx-auto max-w-[900px] px-1 text-center sm:px-0'>
                    <SectionEyebrow name={section.eyebrow} color={colors.eyebrow} />
                    <h2
                        id='explore-the-world-heading'
                        className='agency-section-heading pt-2 text-[28px] font-medium leading-tight sm:pt-3 sm:text-[34px] sm:leading-[40px] lg:pt-4 lg:text-[40px] lg:leading-[48px]'
                        style={{ color: colors.title, fontFamily: 'var(--hp-font-heading)' }}
                    >
                        {section.title}
                    </h2>
                    <p
                        className='mx-auto max-w-[861px] pt-3 text-sm font-normal leading-6 sm:pt-4 sm:text-base sm:leading-7 md:pt-5 md:text-lg md:leading-8'
                        style={{ color: colors.textMuted, fontFamily: 'var(--hp-font-body)' }}
                    >
                        {section.paragraph}
                    </p>
                </header>

                {showLoading ? (
                    <p
                        className='mx-auto max-w-xl pt-10 text-center text-base'
                        style={{ color: colors.textMuted, fontFamily: 'var(--hp-font-body)' }}
                    >
                        Loading tours…
                    </p>
                ) : displayTours.length > 0 ? (
                    <div className='grid grid-cols-1 justify-items-center gap-4 pt-8 xs:gap-5 sm:grid-cols-2 sm:gap-6 sm:pt-10 md:pt-12 lg:grid-cols-3 lg:justify-items-stretch lg:gap-6 lg:pt-14'>
                        {displayTours.map((tour) => (
                            <TourExploreCard
                                key={tour.id}
                                slug={tour.slug}
                                discountPercent={tour.discountPercent}
                                title={tour.title}
                                image={tour.image}
                                detailHref={
                                    isAgencySite === false ? DEMO_TOUR_DETAIL_PATH : undefined
                                }
                            />
                        ))}
                    </div>
                ) : (
                    <p
                        className='mx-auto max-w-xl pt-10 text-center text-base'
                        style={{ color: colors.textMuted, fontFamily: 'var(--hp-font-body)' }}
                    >
                        {section.emptyMessage}
                    </p>
                )}
            </div>
        </section>
    )
}

export default ExploreTheWorld
