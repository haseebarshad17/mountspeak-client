import { SearchResultsSection } from '@/components/pages/search/SearchResultsSection'
import { searchPublishedListings } from '@/services/tours/tours.server'
import type { TourSearchFilters } from '@/services/tours/tours.search.types'
import type { UmrahSearchFilters } from '@/services/tours/tours.umrah-search.utils'

type SearchResultsLoaderProps = {
    filters: TourSearchFilters
    umrahFilters: UmrahSearchFilters
}

export async function SearchResultsLoader({ filters, umrahFilters }: SearchResultsLoaderProps) {
    const tours = await searchPublishedListings(filters, umrahFilters)

    return (
        <SearchResultsSection tours={tours} filters={filters} umrahFilters={umrahFilters} />
    )
}
