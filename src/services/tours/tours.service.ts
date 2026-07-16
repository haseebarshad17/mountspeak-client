import type { SupabaseClient } from '@supabase/supabase-js'

import { mapTourPickupPointRow, type TourPickupPointRow } from './tours.pickup'
import type { TourSearchFilters } from './tours.search.types'
import { filterToursForSearch } from './tours.search.utils'
import { TOUR_PUBLICATION_STATUS, type TourRow } from './tours.types'

const tourColumns = [
    'id',
    'slug',
    'title',
    'category',
    'from_location',
    'to_location',
    'start_date',
    'end_date',
    'price_per_seat',
    'advance_amount_per_seat',
    'discount_percent',
    'kids_discount',
    'capacity_total',
    'confirmed_seats',
    'publication_status',
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

async function enrichTourRowsWithPickupCities(
    supabase: SupabaseClient,
    rows: TourRow[],
): Promise<TourRow[]> {
    if (rows.length === 0) return rows

    const tourIds = rows.map((row) => row.id)
    const { data, error } = await supabase
        .from('tour_pickup_points')
        .select('id, tour_id, city, pickup_time, notes, sort_order, is_primary')
        .in('tour_id', tourIds)
        .order('sort_order', { ascending: true })

    if (error) throw error

    const citiesByTourId = new Map<string, string[]>()
    for (const row of data ?? []) {
        const mapped = mapTourPickupPointRow(row as TourPickupPointRow)
        const existing = citiesByTourId.get(row.tour_id) ?? []
        if (!existing.includes(mapped.city)) {
            existing.push(mapped.city)
        }
        citiesByTourId.set(row.tour_id, existing)
    }

    return rows.map((row) => ({
        ...row,
        pickup_cities: citiesByTourId.get(row.id) ?? [],
    }))
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

            const rows = (data ?? []) as unknown as TourRow[]
            return enrichTourRowsWithPickupCities(supabase, rows)
        },

        getLatestPublishedTours: async (limit: number): Promise<TourRow[]> => {
            let query = supabase
                .from('tours')
                .select(tourColumns)
                .eq('publication_status', TOUR_PUBLICATION_STATUS.published)

            query = applyAgencyFilter(query)

            const { data, error } = await query
                .order('created_at', { ascending: false })
                .limit(limit)

            if (error) throw error

            const rows = (data ?? []) as unknown as TourRow[]
            return enrichTourRowsWithPickupCities(supabase, rows)
        },

        searchPublishedTours: async (filters: TourSearchFilters = {}): Promise<TourRow[]> => {
            let query = supabase
                .from('tours')
                .select(tourColumns)
                .eq('publication_status', TOUR_PUBLICATION_STATUS.published)

            query = applyAgencyFilter(query)

            const startDate = filters.start_date?.trim()
            const endDate = filters.end_date?.trim()
            const category = filters.category

            if (category) {
                query = query.eq('category', category)
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
            const enriched = await enrichTourRowsWithPickupCities(supabase, rows)

            return filterToursForSearch(enriched, filters)
        },

        getPublishedTourLocations: async (): Promise<string[]> => {
            let query = supabase
                .from('tours')
                .select('id, from_location, to_location')
                .eq('publication_status', TOUR_PUBLICATION_STATUS.published)

            query = applyAgencyFilter(query)

            const { data, error } = await query

            if (error) throw error

            const rows = (data ?? []) as Array<{
                id: string
                from_location: string | null
                to_location: string | null
            }>

            const tourIds = rows.map((row) => row.id)
            const { data: pickupRows, error: pickupError } = tourIds.length
                ? await supabase
                      .from('tour_pickup_points')
                      .select('tour_id, city')
                      .in('tour_id', tourIds)
                : { data: [], error: null }

            if (pickupError) throw pickupError

            const locations = new Set<string>()

            for (const row of rows) {
                if (row.from_location?.trim()) locations.add(row.from_location.trim())
                if (row.to_location?.trim()) locations.add(row.to_location.trim())
            }

            for (const row of pickupRows ?? []) {
                if (row.city?.trim()) locations.add(row.city.trim())
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
