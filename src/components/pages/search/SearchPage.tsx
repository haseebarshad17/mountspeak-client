'use client'

import { useEffect, type ReactNode } from 'react'

import HeroFilters from '@/components/pages/marketing/home/HeroFilters'
import { PageHeroBanner } from '@/components/ui/page-hero-banner'
import { STATIC_UI_COLORS } from '@/data/homepage'
import { useHeroBackgroundImage } from '@/hooks/useHeroBackgroundImage'
import { useHomepagePageWithFallback } from '@/hooks/useHomepagePageWithFallback'
import {
    listingUsesPackageCopy,
    shouldUseSingleSpecUmrahUx,
    type ListingKind,
} from '@/lib/homepage/specialization'
import { cn } from '@/lib/utils/clsxUtils'
import { getOrCreateEventSessionId } from '@/services/events/events.session'
import { useTrackEvent } from '@/services/events/useTrackEvent'
import {
    selectHomepageAgencySpecializationIds,
    selectHomepageSpecializationId,
    selectHomepageSpecializations,
} from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'
import type { TourSearchFilters } from '@/services/tours/tours.search.types'
import {
    formatTourSearchSummary,
    hasTourSearchFilters,
} from '@/services/tours/tours.search.utils'
import {
    formatUmrahSearchSummary,
    hasUmrahSearchFilters,
    type UmrahSearchFilters,
} from '@/services/tours/tours.umrah-search.utils'

type SearchPageProps = {
    children: ReactNode
    filters: TourSearchFilters
    umrahFilters: UmrahSearchFilters
    tourLocations: string[]
    listingType: ListingKind
}

export default function SearchPage({
    children,
    filters,
    umrahFilters,
    tourLocations,
    listingType,
}: SearchPageProps) {
    const page = useHomepagePageWithFallback()
    const specializationId = useAppSelector(selectHomepageSpecializationId)
    const agencySpecializationIds = useAppSelector(selectHomepageAgencySpecializationIds)
    const specializations = useAppSelector(selectHomepageSpecializations)
    const usesPackageCopy = listingUsesPackageCopy(
        listingType,
        specializationId,
        agencySpecializationIds,
        specializations,
    )
    const isPackageSearch =
        listingType === 'umrah' ||
        listingType === 'international' ||
        shouldUseSingleSpecUmrahUx(specializationId, agencySpecializationIds, specializations)
    const backgroundImage = useHeroBackgroundImage()
    const trackEvent = useTrackEvent()

    const summary = isPackageSearch
        ? formatUmrahSearchSummary(umrahFilters)
        : formatTourSearchSummary(filters)

    useEffect(() => {
        const hasFilters = isPackageSearch
            ? hasUmrahSearchFilters(umrahFilters)
            : hasTourSearchFilters(filters)
        if (!hasFilters) return

        const fingerprint = isPackageSearch
            ? JSON.stringify({
                  duration: umrahFilters.duration ?? '',
                  passengers: umrahFilters.passengers ?? '',
                  packageType: umrahFilters.packageType ?? '',
              })
            : JSON.stringify({
                  from: filters.from ?? '',
                  to: filters.to ?? '',
                  start_date: filters.start_date ?? '',
                  end_date: filters.end_date ?? '',
                  category: filters.category ?? '',
              })

        const sessionId = getOrCreateEventSessionId()
        const dedupeKey = `tour_search:${sessionId}:${fingerprint}`

        try {
            if (typeof window !== 'undefined' && sessionStorage.getItem(dedupeKey)) {
                return
            }
            sessionStorage.setItem(dedupeKey, '1')
        } catch {
            // private mode / blocked storage — still track
        }

        trackEvent({
            event_type: 'TOUR_SEARCH',
            path: typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/search',
            metadata: isPackageSearch
                ? {
                      summary,
                      listing_type: listingType,
                      duration: umrahFilters.duration ?? null,
                      passengers: umrahFilters.passengers ?? null,
                      package_type: umrahFilters.packageType ?? null,
                  }
                : {
                      summary,
                      is_umrah: false,
                      from: filters.from ?? null,
                      to: filters.to ?? null,
                      start_date: filters.start_date ?? null,
                      end_date: filters.end_date ?? null,
                      category: filters.category ?? null,
                  },
        })
    }, [filters, umrahFilters, isPackageSearch, listingType, summary, trackEvent])

    const heroCopy = usesPackageCopy
        ? {
              title: listingType === 'international' ? 'Find your international tour' : 'Find your Umrah package',
              description:
                  listingType === 'international'
                      ? 'Select duration, passengers, and package type to browse international tours.'
                      : 'Select package duration, number of passengers, and package type to browse available Umrah packages.',
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
                            listingType={listingType}
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
                                : usesPackageCopy
                                  ? listingType === 'international'
                                      ? 'Explore available international tours and pick the one that suits you.'
                                      : 'Explore available Umrah packages and pick the one that suits you.'
                                  : 'Explore available trips and pick your next adventure.'}
                        </p>
                    </header>

                    {children}
                </div>
            </main>
        </>
    )
}
