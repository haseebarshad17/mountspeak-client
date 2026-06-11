export type { TourRecord } from './tours.payload.types'

export type TourPublicationStatus = 'PUBLISHED' | 'UNPUBLISHED'

export const TOUR_PUBLICATION_STATUS = {
    published: 'PUBLISHED',
    unpublished: 'UNPUBLISHED',
} as const satisfies Record<string, TourPublicationStatus>

/** Alias for Supabase row */
export type TourRow = import('./tours.payload.types').TourRecord

export type TourListItem = {
    id: string
    slug: string
    title: string
    discountLabel: string
    discountPercent: number | null
    image: string
}
