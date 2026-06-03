import type { SupabaseClient } from '@supabase/supabase-js'

import type { TourSearchFilters } from './tours.search.types'
import { sortToursForSearch } from './tours.search.utils'
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
}

export const toursService = ({ supabase }: ToursServiceProps) => {
    return {
        getPublishedTours: async (): Promise<TourRow[]> => {
            const { data, error } = await supabase
                .from('tours')
                .select(tourColumns)
                .eq('publication_status', TOUR_PUBLICATION_STATUS.published)
                .order('created_at', { ascending: false })

            if (error) throw error

            return (data ?? []) as unknown as TourRow[]
        },

        searchPublishedTours: async (filters: TourSearchFilters = {}): Promise<TourRow[]> => {
            let query = supabase
                .from('tours')
                .select(tourColumns)
                .eq('publication_status', TOUR_PUBLICATION_STATUS.published)

            const from = filters.from?.trim()
            const to = filters.to?.trim()

            // When from is set, load all tours from that city (exact matches sorted first in app).
            // When only to is set, filter by destination at the database.
            if (from) {
                query = query.ilike('from_location', `%${from}%`)
            } else if (to) {
                query = query.ilike('to_location', `%${to}%`)
            }

            if (filters.date?.trim()) {
                query = query
                    .lte('start_date', filters.date.trim())
                    .gte('end_date', filters.date.trim())
            }

            const { data, error } = await query.order('created_at', { ascending: false })

            if (error) throw error

            const rows = (data ?? []) as unknown as TourRow[]

            if (from || to) {
                return sortToursForSearch(rows, filters)
            }

            return rows
        },

        getPublishedTourLocations: async (): Promise<string[]> => {
            const { data, error } = await supabase
                .from('tours')
                .select('from_location, to_location')
                .eq('publication_status', TOUR_PUBLICATION_STATUS.published)

            if (error) throw error

            const locations = new Set<string>()

            for (const row of data ?? []) {
                if (row.from_location?.trim()) locations.add(row.from_location.trim())
                if (row.to_location?.trim()) locations.add(row.to_location.trim())
            }

            return [...locations].sort((a, b) => a.localeCompare(b))
        },

        getPublishedTourBySlug: async (slug: string): Promise<TourRow | null> => {
            const { data, error } = await supabase
                .from('tours')
                .select(tourColumns)
                .eq('slug', slug)
                .eq('publication_status', TOUR_PUBLICATION_STATUS.published)
                .maybeSingle()

            if (error) throw error

            return (data as unknown as TourRow | null) ?? null
        },
    }
}
