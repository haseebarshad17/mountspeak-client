import type { Metadata } from 'next'

import SearchPage from '@/components/pages/search/SearchPage'
import { parseTourSearchParams } from '@/services/tours/tours.search.utils'
import { fetchTourLocationOptions, searchPublishedTours } from '@/services/tours/tours.server'

export const metadata: Metadata = {
    title: 'Search Trips | Pakistan Travel',
    description: 'Browse available trips and destinations.',
}

type SearchRouteProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Page({ searchParams }: SearchRouteProps) {
    const params = await searchParams
    const filters = parseTourSearchParams(params)

    const [tours, tourLocations] = await Promise.all([
        searchPublishedTours(filters),
        fetchTourLocationOptions(),
    ])

    return (
        <SearchPage
            tours={tours}
            filters={filters}
            tourLocations={tourLocations}
        />
    )
}
