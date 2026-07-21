import type { SupabaseClient } from '@supabase/supabase-js'

import { toApiError } from '@/lib/api/errors'
import { MessageCode } from '@/lib/messages/codes'
import { mapInternationalTourRowsToListItems } from '@/services/international-tour/international-tour.utils'
import type { InternationalTourRow } from '@/services/international-tour/international-tour.types'
import { mapTourRowsToListItemsWithSlots } from '@/services/tours/tour-seat-availability'
import type { TourRow } from '@/services/tours/tours.types'
import { mapUmrahPlanRowsToListItems } from '@/services/umrah-plan/umrah-plan.utils'
import type { UmrahPlanRow } from '@/services/umrah-plan/umrah-plan.types'

import type {
    SaveListingParams,
    SavedListingKind,
    SavedTourDisplay,
    SavedTourRow,
    UnsaveListingParams,
} from './saved-tours.types'
import { resolveSavedListingKind, savedListingKey } from './saved-tours.types'

const TOUR_EMBED_SELECT = `
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
`

const PACKAGE_EMBED_SELECT = `
    id,
    agency_id,
    basic_information,
    pricing,
    duration_dates,
    booking_info,
    images,
    descriptions,
    seo,
    created_at
`

const SAVED_TOURS_SELECT = `
  tour_id,
  umrah_plan_id,
  international_tour_id,
  agency_id,
  user_id,
  created_at,
  tours (${TOUR_EMBED_SELECT}),
  umrah_plan:umrah_plan (${PACKAGE_EMBED_SELECT}),
  international_tour:international_tour (${PACKAGE_EMBED_SELECT})
`

type SavedToursServiceProps = {
    supabase: SupabaseClient
}

function unwrapRelation<T>(value: T | T[] | null | undefined): T | null {
    if (!value) return null
    return Array.isArray(value) ? (value[0] ?? null) : value
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

function productColumn(listingKind: SavedListingKind): 'tour_id' | 'umrah_plan_id' | 'international_tour_id' {
    if (listingKind === 'umrah') return 'umrah_plan_id'
    if (listingKind === 'international') return 'international_tour_id'
    return 'tour_id'
}

export const savedToursService = ({ supabase }: SavedToursServiceProps) => {
    return {
        listSavedListingKeys: async (agencyId?: string): Promise<string[]> => {
            const userId = await requireUserId(supabase)

            let query = supabase
                .from('saved_tours')
                .select('tour_id, umrah_plan_id, international_tour_id')
                .eq('user_id', userId)

            if (agencyId) {
                query = query.eq('agency_id', agencyId)
            }

            const { data, error } = await query

            if (error) {
                throw toApiError(error, MessageCode.API_SAVED_TOURS_LOAD_FAILED)
            }

            return (data ?? [])
                .map((row) => {
                    const kind = resolveSavedListingKind(row)
                    const id =
                        kind === 'umrah'
                            ? row.umrah_plan_id
                            : kind === 'international'
                              ? row.international_tour_id
                              : row.tour_id
                    if (!kind || !id) return null
                    return savedListingKey(kind, id)
                })
                .filter((key): key is string => Boolean(key))
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
            const umrahRows: UmrahPlanRow[] = []
            const internationalRows: InternationalTourRow[] = []
            const savedAtByKey = new Map<string, string | undefined>()
            const orderKeys: string[] = []

            for (const row of rows) {
                const kind = resolveSavedListingKind(row)
                if (!kind) continue

                if (kind === 'tour') {
                    const tour = unwrapRelation(row.tours)
                    if (!tour) continue
                    tourRows.push(tour)
                    const key = savedListingKey('tour', tour.id)
                    savedAtByKey.set(key, row.created_at)
                    orderKeys.push(key)
                    continue
                }

                if (kind === 'umrah') {
                    const plan = unwrapRelation(row.umrah_plan)
                    if (!plan) continue
                    umrahRows.push(plan)
                    const key = savedListingKey('umrah', plan.id)
                    savedAtByKey.set(key, row.created_at)
                    orderKeys.push(key)
                    continue
                }

                const plan = unwrapRelation(row.international_tour)
                if (!plan) continue
                internationalRows.push(plan)
                const key = savedListingKey('international', plan.id)
                savedAtByKey.set(key, row.created_at)
                orderKeys.push(key)
            }

            const [domesticItems, umrahItems, internationalItems] = await Promise.all([
                mapTourRowsToListItemsWithSlots(supabase, tourRows),
                Promise.resolve(mapUmrahPlanRowsToListItems(umrahRows)),
                Promise.resolve(mapInternationalTourRowsToListItems(internationalRows)),
            ])

            const byKey = new Map<string, SavedTourDisplay>()

            for (const item of domesticItems) {
                const key = savedListingKey('tour', item.id)
                byKey.set(key, {
                    ...item,
                    listingKind: 'tour',
                    savedAt: savedAtByKey.get(key),
                })
            }

            for (const item of umrahItems) {
                const key = savedListingKey('umrah', item.id)
                byKey.set(key, {
                    ...item,
                    listingKind: 'umrah',
                    savedAt: savedAtByKey.get(key),
                })
            }

            for (const item of internationalItems) {
                const key = savedListingKey('international', item.id)
                byKey.set(key, {
                    ...item,
                    listingKind: 'international',
                    savedAt: savedAtByKey.get(key),
                })
            }

            return orderKeys
                .map((key) => byKey.get(key))
                .filter((item): item is SavedTourDisplay => Boolean(item))
        },

        saveListing: async ({ listingKind, listingId, agencyId }: SaveListingParams) => {
            const userId = await requireUserId(supabase)
            const column = productColumn(listingKind)

            const { error } = await supabase.from('saved_tours').insert({
                user_id: userId,
                agency_id: agencyId,
                tour_id: null,
                umrah_plan_id: null,
                international_tour_id: null,
                [column]: listingId,
            })

            // Already saved — treat as success
            if (error && error.code !== '23505') {
                throw toApiError(error, MessageCode.API_SAVED_TOUR_SAVE_FAILED)
            }
        },

        unsaveListing: async ({ listingKind, listingId, agencyId }: UnsaveListingParams) => {
            const userId = await requireUserId(supabase)
            const column = productColumn(listingKind)

            let query = supabase
                .from('saved_tours')
                .delete()
                .eq('user_id', userId)
                .eq(column, listingId)

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
