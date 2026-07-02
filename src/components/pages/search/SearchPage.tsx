'use client'

import type { ReactNode } from 'react'

import HeroFilters from '@/components/pages/marketing/home/HeroFilters'
import { PageHeroBanner } from '@/components/ui/page-hero-banner'
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
import { formatTourSearchSummary } from '@/services/tours/tours.search.utils'
import {
    formatUmrahSearchSummary,
    type UmrahSearchFilters,
} from '@/services/tours/tours.umrah-search.utils'

type SearchPageProps = {
    children: ReactNode
    filters: TourSearchFilters
    umrahFilters: UmrahSearchFilters
    tourLocations: string[]
}

export default function SearchPage({
    children,
    filters,
    umrahFilters,
    tourLocations,
}: SearchPageProps) {
    const page = useHomepagePageWithFallback()
    const specializationId = useAppSelector(selectHomepageSpecializationId)
    const specializations = useAppSelector(selectHomepageSpecializations)
    const isUmrahSearch = usesHajjUmrahBanner(specializationId, specializations)
    const backgroundImage = useHeroBackgroundImage()

    const summary = isUmrahSearch
        ? formatUmrahSearchSummary(umrahFilters)
        : formatTourSearchSummary(filters)

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
                bannerClassName='h-auto sm:min-h-[460px] lg:min-h-[480px]'
                className='px-2 pt-2 pb-0 sm:px-3 sm:pt-3 md:px-4 md:pt-4 lg:px-5 lg:pt-5'
            >
                <div
                    className={cn(
                        'flex h-auto flex-col justify-start px-4 text-center text-white sm:px-6',
                        'pt-[140px] sm:pt-36 md:pt-40 lg:pt-44 xl:pt-48',
                        'pb-8 sm:pb-10',
                    )}
                >
                    <div className='mx-auto w-full max-w-[828px]'>
                        <h1 className='text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl xl:text-[45px]'>
                            {heroCopy.title}
                        </h1>
                        <p className='mx-auto mt-3 max-w-[640px] text-sm leading-6 text-white/90 sm:mt-4 sm:text-base xl:text-lg'>
                            {heroCopy.description}
                        </p>
                    </div>

                    <div className='mx-auto w-full max-w-[867px] pt-8 sm:pt-10'>
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
                    </header>

                    {children}
                </div>
            </main>
        </>
    )
}
