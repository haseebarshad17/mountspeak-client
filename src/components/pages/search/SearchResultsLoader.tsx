import { SearchResultsSection } from '@/components/pages/search/SearchResultsSection'
import { searchPublishedListings } from '@/services/tours/tours.server'
import type { ListingKind } from '@/lib/homepage/specialization'
import type { TourSearchFilters } from '@/services/tours/tours.search.types'
import type { UmrahSearchFilters } from '@/services/tours/tours.umrah-search.utils'

type SearchResultsLoaderProps = {
    filters: TourSearchFilters
    umrahFilters: UmrahSearchFilters
    listingType: ListingKind
}

export async function SearchResultsLoader({
    filters,
    umrahFilters,
    listingType,
}: SearchResultsLoaderProps) {
    const tours = await searchPublishedListings(filters, umrahFilters, listingType)

    return (
        <SearchResultsSection
            tours={tours}
            filters={filters}
            umrahFilters={umrahFilters}
            listingType={listingType}
        />
    )
}
