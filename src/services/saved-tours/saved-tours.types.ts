import type { ListingKind } from '@/lib/homepage/specialization'
import type { TourListItem } from '@/services/tours/tours.types'
import type { TourRow } from '@/services/tours/tours.types'
import type { UmrahPlanRow } from '@/services/umrah-plan/umrah-plan.types'
import type { InternationalTourRow } from '@/services/international-tour/international-tour.types'

export type SavedListingKind = ListingKind

export type SavedTourRow = {
    tour_id: string | null
    umrah_plan_id?: string | null
    international_tour_id?: string | null
    agency_id: string | null
    user_id: string
    created_at?: string
    tours: TourRow | TourRow[] | null
    umrah_plan?: UmrahPlanRow | UmrahPlanRow[] | null
    international_tour?: InternationalTourRow | InternationalTourRow[] | null
}

export type SavedTourDisplay = TourListItem & {
    savedAt?: string
    listingKind: SavedListingKind
}

export type SaveListingParams = {
    listingKind: SavedListingKind
    listingId: string
    agencyId: string
}

export type UnsaveListingParams = {
    listingKind: SavedListingKind
    listingId: string
    agencyId?: string
}

/** @deprecated Prefer SaveListingParams */
export type SaveTourParams = {
    tourId: string
    agencyId: string
}

/** @deprecated Prefer UnsaveListingParams */
export type UnsaveTourParams = {
    tourId: string
    agencyId?: string
}

export function savedListingKey(listingKind: SavedListingKind, listingId: string): string {
    return `${listingKind}:${listingId}`
}

export function resolveSavedListingKind(row: Pick<
    SavedTourRow,
    'tour_id' | 'umrah_plan_id' | 'international_tour_id'
>): SavedListingKind | null {
    if (row.umrah_plan_id) return 'umrah'
    if (row.international_tour_id) return 'international'
    if (row.tour_id) return 'tour'
    return null
}
