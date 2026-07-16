import type { TourCategory } from './tours.category'

export type TourSearchFilters = {
    from?: string
    to?: string
    start_date?: string
    end_date?: string
    category?: TourCategory
}
