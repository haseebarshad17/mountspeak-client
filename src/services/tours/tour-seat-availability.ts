import type { SupabaseClient } from '@supabase/supabase-js'

import type { TourListItem, TourRow } from './tours.types'
import { toTourListItem } from './tours.utils'

const CONFIRMED_BOOKING_STATUSES = ['CONFIRMED', 'confirmed', 'Confirmed'] as const

type BookingSeatRow = {
    tour_id: string
    male_seat: number | null
    female_seat: number | null
    kids_seats: number | null
}

export async function fetchConfirmedSeatsByTourId(
    supabase: SupabaseClient,
    tourIds: string[],
): Promise<Record<string, number>> {
    if (tourIds.length === 0) return {}

    const { data, error } = await supabase
        .from('bookings')
        .select('tour_id, male_seat, female_seat, kids_seats')
        .in('tour_id', tourIds)
        .in('status', [...CONFIRMED_BOOKING_STATUSES])

    if (error) return {}

    const totals: Record<string, number> = {}

    for (const row of (data ?? []) as BookingSeatRow[]) {
        const seats =
            Number(row.male_seat ?? 0) +
            Number(row.female_seat ?? 0) +
            Number(row.kids_seats ?? 0)

        totals[row.tour_id] = (totals[row.tour_id] ?? 0) + seats
    }

    return totals
}

export function mapTourRowsToListItems(
    rows: TourRow[],
    confirmedSeatsByTourId: Record<string, number> = {},
): TourListItem[] {
    return rows.map((row) => toTourListItem(row, confirmedSeatsByTourId[row.id] ?? 0))
}
