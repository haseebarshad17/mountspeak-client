import type { SupabaseClient } from '@supabase/supabase-js'

import { toApiError } from '@/lib/api/errors'
import { MessageCode } from '@/lib/messages/codes'
import { mapTourRowsToListItems } from '@/services/tours/tour-seat-availability'
import type { TourRow } from '@/services/tours/tours.types'

import type {
    SaveTourParams,
    SavedTourDisplay,
    SavedTourRow,
    UnsaveTourParams,
} from './saved-tours.types'

const SAVED_TOURS_SELECT = `
  tour_id,
  agency_id,
  user_id,
  created_at,
  tours (
    id,
    slug,
    title,
    from_location,
    to_location,
    start_date,
    end_date,
    price_per_seat,
    discount_percent,
    kids_discount,
    capacity_total,
    confirmed_seats,
    publication_status,
    agency_id,
    created_at,
    header,
    overview,
    highlights,
    route,
    places_visited,
    journey,
    stay_and_dine,
    expedition_perks,
    visual_fragments
  )
`

type SavedToursServiceProps = {
    supabase: SupabaseClient
}

function unwrapTour(tours: SavedTourRow['tours']): TourRow | null {
    if (!tours) return null
    return Array.isArray(tours) ? (tours[0] ?? null) : tours
}

async function requireUserId(supabase: SupabaseClient): Promise<string> {
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser()

    if (error || !user?.id) {
        throw toApiError(error, MessageCode.SAVED_TOUR_SIGN_IN_REQUIRED)
    }

    return user.id
}

export const savedToursService = ({ supabase }: SavedToursServiceProps) => {
    return {
        listSavedTourIds: async (agencyId?: string): Promise<string[]> => {
            const userId = await requireUserId(supabase)

            let query = supabase
                .from('saved_tours')
                .select('tour_id')
                .eq('user_id', userId)

            if (agencyId) {
                query = query.eq('agency_id', agencyId)
            }

            const { data, error } = await query

            if (error) {
                throw toApiError(error, MessageCode.API_SAVED_TOURS_LOAD_FAILED)
            }

            return (data ?? [])
                .map((row) => row.tour_id as string)
                .filter(Boolean)
        },

        listSavedTours: async (agencyId?: string): Promise<SavedTourDisplay[]> => {
            const userId = await requireUserId(supabase)

            let query = supabase
                .from('saved_tours')
                .select(SAVED_TOURS_SELECT)
                .eq('user_id', userId)

            if (agencyId) {
                query = query.eq('agency_id', agencyId)
            }

            const { data, error } = await query.order('created_at', { ascending: false })

            if (error) {
                throw toApiError(error, MessageCode.API_SAVED_TOURS_LOAD_FAILED)
            }

            const rows = (data ?? []) as SavedTourRow[]
            const tourRows: TourRow[] = []
            const savedAtByTourId = new Map<string, string | undefined>()

            for (const row of rows) {
                const tour = unwrapTour(row.tours)
                if (!tour) continue
                tourRows.push(tour)
                savedAtByTourId.set(tour.id, row.created_at)
            }

            return mapTourRowsToListItems(tourRows).map((item) => ({
                ...item,
                savedAt: savedAtByTourId.get(item.id),
            }))
        },

        saveTour: async ({ tourId, agencyId }: SaveTourParams) => {
            const userId = await requireUserId(supabase)

            const { error } = await supabase.from('saved_tours').insert({
                user_id: userId,
                tour_id: tourId,
                agency_id: agencyId,
            })

            // Already saved — treat as success
            if (error && error.code !== '23505') {
                throw toApiError(error, MessageCode.API_SAVED_TOUR_SAVE_FAILED)
            }
        },

        unsaveTour: async ({ tourId, agencyId }: UnsaveTourParams) => {
            const userId = await requireUserId(supabase)

            let query = supabase
                .from('saved_tours')
                .delete()
                .eq('user_id', userId)
                .eq('tour_id', tourId)

            if (agencyId) {
                query = query.eq('agency_id', agencyId)
            }

            const { error } = await query

            if (error) {
                throw toApiError(error, MessageCode.API_SAVED_TOUR_SAVE_FAILED)
            }
        },
    }
}
