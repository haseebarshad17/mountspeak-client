import type { Metadata } from 'next'

import SearchPage from '@/components/pages/search/SearchPage'
import { buildPageMetadata } from '@/lib/homepage/build-page-metadata'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'
import { parseTourSearchParams } from '@/services/tours/tours.search.utils'
import { parseUmrahSearchParams } from '@/services/tours/tours.umrah-search.utils'
import { fetchTourLocationOptions, searchPublishedTours } from '@/services/tours/tours.server'

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

export default async function Page({ searchParams }: SearchRouteProps) {
    const params = await searchParams
    const filters = parseTourSearchParams(params)
    const umrahFilters = parseUmrahSearchParams(params)

    const [tours, tourLocations] = await Promise.all([
        searchPublishedTours(filters),
        fetchTourLocationOptions(),
    ])

    return (
        <SearchPage
            tours={tours}
            filters={filters}
            umrahFilters={umrahFilters}
            tourLocations={tourLocations}
        />
    )
}
