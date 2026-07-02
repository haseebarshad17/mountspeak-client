import { Suspense } from 'react'
import type { Metadata } from 'next'

import SearchPage from '@/components/pages/search/SearchPage'
import { SearchResultsLoader } from '@/components/pages/search/SearchResultsLoader'
import { SearchResultsSkeleton } from '@/components/pages/search/SearchResultsSkeleton'
import { buildPageMetadata } from '@/lib/homepage/build-page-metadata'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'
import { parseTourSearchParams } from '@/services/tours/tours.search.utils'
import { parseUmrahSearchParams } from '@/services/tours/tours.umrah-search.utils'
import { fetchTourLocationOptions } from '@/services/tours/tours.server'

export async function generateMetadata(): Promise<Metadata> {
    const homepage = await fetchAgencyHomepage()

    return await buildPageMetadata({
        pageTitle: 'Search Trips',
        description: 'Browse available trips and destinations.',
        homepage,
    })
}

type SearchRouteProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}

function buildSearchSuspenseKey(
    filters: ReturnType<typeof parseTourSearchParams>,
    umrahFilters: ReturnType<typeof parseUmrahSearchParams>,
) {
    return JSON.stringify({ filters, umrahFilters })
}

export default async function Page({ searchParams }: SearchRouteProps) {
    const params = await searchParams
    const filters = parseTourSearchParams(params)
    const umrahFilters = parseUmrahSearchParams(params)
    const tourLocations = await fetchTourLocationOptions()
    const suspenseKey = buildSearchSuspenseKey(filters, umrahFilters)

    return (
        <SearchPage
            filters={filters}
            umrahFilters={umrahFilters}
            tourLocations={tourLocations}
        >
            <Suspense key={suspenseKey} fallback={<SearchResultsSkeleton />}>
                <SearchResultsLoader filters={filters} umrahFilters={umrahFilters} />
            </Suspense>
        </SearchPage>
    )
}
