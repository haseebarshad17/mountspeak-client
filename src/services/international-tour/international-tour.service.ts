import type { SupabaseClient } from '@supabase/supabase-js'

import type { UmrahSearchFilters } from '@/services/tours/tours.umrah-search.utils'
import { hasUmrahSearchFilters } from '@/services/tours/tours.umrah-search.utils'

import { filterInternationalToursForSearch } from './international-tour.utils'
import { INTERNATIONAL_TOUR_STATUS, type InternationalTourRow } from './international-tour.types'

const planListColumns = [
    'id',
    'agency_id',
    'basic_information',
    'pricing',
    'duration_dates',
    'booking_info',
    'images',
    'descriptions',
    'seo',
    'created_at',
].join(', ')

const planDetailColumns = `${planListColumns},hotels,itinerary,package_includes`

type InternationalTourServiceProps = {
    supabase: SupabaseClient
    agencyId?: string
}

export const internationalTourService = ({ supabase, agencyId }: InternationalTourServiceProps) => {
    const publishedQuery = () => {
        let query = supabase
            .from('international_tour')
            .select(planListColumns)
            .filter('basic_information->>package_status', 'eq', INTERNATIONAL_TOUR_STATUS.active)

        if (agencyId) {
            query = query.eq('agency_id', agencyId)
        }

        return query.order('created_at', { ascending: false })
    }

    return {
        getPublishedPlans: async (): Promise<InternationalTourRow[]> => {
            const { data, error } = await publishedQuery()

            if (error) throw error

            return (data ?? []) as unknown as InternationalTourRow[]
        },

        getPublishedPlanById: async (planId: string): Promise<InternationalTourRow | null> => {
            let query = supabase
                .from('international_tour')
                .select(planDetailColumns)
                .eq('id', planId)
                .filter('basic_information->>package_status', 'eq', INTERNATIONAL_TOUR_STATUS.active)

            if (agencyId) {
                query = query.eq('agency_id', agencyId)
            }

            const { data, error } = await query.maybeSingle()

            if (error) throw error
            return (data ?? null) as unknown as InternationalTourRow | null
        },

        getLatestPublishedPlans: async (limit: number): Promise<InternationalTourRow[]> => {
            const { data, error } = await publishedQuery().limit(limit)

            if (error) throw error

            return (data ?? []) as unknown as InternationalTourRow[]
        },

        searchPublishedPlans: async (filters: UmrahSearchFilters = {}): Promise<InternationalTourRow[]> => {
            const { data, error } = await publishedQuery()

            if (error) throw error

            const rows = (data ?? []) as unknown as InternationalTourRow[]

            if (!hasUmrahSearchFilters(filters)) {
                return rows
            }

            return filterInternationalToursForSearch(rows, filters)
        },
    }
}
