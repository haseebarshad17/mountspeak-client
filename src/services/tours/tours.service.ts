import type { SupabaseClient } from '@supabase/supabase-js'

import type { TourSearchFilters } from './tours.search.types'
import { filterToursForSearch } from './tours.search.utils'
import { TOUR_PUBLICATION_STATUS, type TourRow } from './tours.types'

const tourColumns = [
    'id',
    'slug',
    'title',
    'from_location',
    'to_location',
    'start_date',
    'end_date',
    'price_per_seat',
    'discount_percent',
    'kids_discount',
    'capacity_total',
    'confirmed_seats',
    'publication_status',
    'driver_id',
    'agency_id',
    'created_at',
    'header',
    'overview',
    'highlights',
    'route',
    'places_visited',
    'journey',
    'stay_and_dine',
    'expedition_perks',
    'visual_fragments',
].join(', ')

type ToursServiceProps = {
    supabase: SupabaseClient
    agencyId?: string
}

export const toursService = ({ supabase, agencyId }: ToursServiceProps) => {
    const applyAgencyFilter = <T extends { eq: (column: string, value: string) => T }>(query: T) => {
        if (agencyId) {
            return query.eq('agency_id', agencyId)
        }
        return query
    }

    return {
        getPublishedTours: async (): Promise<TourRow[]> => {
            let query = supabase
                .from('tours')
                .select(tourColumns)
                .eq('publication_status', TOUR_PUBLICATION_STATUS.published)

            query = applyAgencyFilter(query)

            const { data, error } = await query.order('created_at', { ascending: false })

            if (error) throw error

            return (data ?? []) as unknown as TourRow[]
        },

        searchPublishedTours: async (filters: TourSearchFilters = {}): Promise<TourRow[]> => {
            let query = supabase
                .from('tours')
                .select(tourColumns)
                .eq('publication_status', TOUR_PUBLICATION_STATUS.published)

            query = applyAgencyFilter(query)

            const from = filters.from?.trim()
            const to = filters.to?.trim()
            const startDate = filters.start_date?.trim()
            const endDate = filters.end_date?.trim()

            if (from && to) {
                query = query.ilike('from_location', `%${from}%`).ilike('to_location', `%${to}%`)
            } else if (from) {
                query = query.ilike('from_location', `%${from}%`)
            } else if (to) {
                query = query.ilike('to_location', `%${to}%`)
            }

            if (startDate && endDate) {
                query = query.lte('start_date', endDate).gte('end_date', startDate)
            } else if (startDate) {
                query = query.lte('start_date', startDate).gte('end_date', startDate)
            } else if (endDate) {
                query = query.lte('start_date', endDate).gte('end_date', endDate)
            }

            const { data, error } = await query.order('created_at', { ascending: false })

            if (error) throw error

            const rows = (data ?? []) as unknown as TourRow[]

            return filterToursForSearch(rows, filters)
        },

        getPublishedTourLocations: async (): Promise<string[]> => {
            let query = supabase
                .from('tours')
                .select('from_location, to_location')
                .eq('publication_status', TOUR_PUBLICATION_STATUS.published)

            query = applyAgencyFilter(query)

            const { data, error } = await query

            if (error) throw error

            const locations = new Set<string>()

            for (const row of data ?? []) {
                if (row.from_location?.trim()) locations.add(row.from_location.trim())
                if (row.to_location?.trim()) locations.add(row.to_location.trim())
            }

            return [...locations].sort((a, b) => a.localeCompare(b))
        },

        getPublishedTourBySlug: async (slug: string): Promise<TourRow | null> => {
            let query = supabase
                .from('tours')
                .select(tourColumns)
                .eq('slug', slug)
                .eq('publication_status', TOUR_PUBLICATION_STATUS.published)

            query = applyAgencyFilter(query)

            const { data, error } = await query.maybeSingle()

            if (error) throw error

            return (data as unknown as TourRow | null) ?? null
        },
    }
}
