import type { SupabaseClient } from '@supabase/supabase-js'

import type { UmrahSearchFilters } from '@/services/tours/tours.umrah-search.utils'
import { hasUmrahSearchFilters } from '@/services/tours/tours.umrah-search.utils'

import { filterUmrahPlansForSearch } from './umrah-plan.utils'
import { UMRAH_PLAN_STATUS, type UmrahPlanRow } from './umrah-plan.types'

const planColumns = [
    'id',
    'agency_id',
    'basic_information',
    'pricing',
    'duration_dates',
    'booking_info',
    'images',
    'created_at',
].join(', ')

type UmrahPlanServiceProps = {
    supabase: SupabaseClient
    agencyId?: string
}

export const umrahPlanService = ({ supabase, agencyId }: UmrahPlanServiceProps) => {
    const publishedQuery = () => {
        let query = supabase
            .from('umrah_plan')
            .select(planColumns)
            .filter('basic_information->>package_status', 'eq', UMRAH_PLAN_STATUS.active)

        if (agencyId) {
            query = query.eq('agency_id', agencyId)
        }

        return query.order('created_at', { ascending: false })
    }

    return {
        getPublishedPlans: async (): Promise<UmrahPlanRow[]> => {
            const { data, error } = await publishedQuery()

            if (error) throw error

            return (data ?? []) as unknown as UmrahPlanRow[]
        },

        getLatestPublishedPlans: async (limit: number): Promise<UmrahPlanRow[]> => {
            const { data, error } = await publishedQuery().limit(limit)

            if (error) throw error

            return (data ?? []) as unknown as UmrahPlanRow[]
        },

        searchPublishedPlans: async (filters: UmrahSearchFilters = {}): Promise<UmrahPlanRow[]> => {
            const { data, error } = await publishedQuery()

            if (error) throw error

            const rows = (data ?? []) as unknown as UmrahPlanRow[]

            if (!hasUmrahSearchFilters(filters)) {
                return rows
            }

            return filterUmrahPlansForSearch(rows, filters)
        },
    }
}
