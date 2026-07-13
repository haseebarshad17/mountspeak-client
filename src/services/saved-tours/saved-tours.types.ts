import type { TourListItem } from '@/services/tours/tours.types'
import type { TourRow } from '@/services/tours/tours.types'

export type SavedTourRow = {
    tour_id: string
    agency_id: string | null
    user_id: string
    created_at?: string
    tours: TourRow | TourRow[] | null
}

export type SavedTourDisplay = TourListItem & {
    savedAt?: string
}

export type SaveTourParams = {
    tourId: string
    agencyId: string
}

export type UnsaveTourParams = {
    tourId: string
    agencyId?: string
}
