import type { SupabaseClient } from '@supabase/supabase-js'

import { fetchTourListDepartureSlotsByTourIds } from './tour-list-slots'
import type { TourListDepartureSlot, TourListItem, TourRow } from './tours.types'
import { toTourListItem } from './tours.utils'

export function mapTourRowsToListItems(
    rows: TourRow[],
    slotsByTourId?: Map<string, TourListDepartureSlot[]>,
): TourListItem[] {
    return rows.map((row) => toTourListItem(row, slotsByTourId?.get(row.id) ?? []))
}

export async function mapTourRowsToListItemsWithSlots(
    supabase: SupabaseClient,
    rows: TourRow[],
): Promise<TourListItem[]> {
    const slotsByTourId = await fetchTourListDepartureSlotsByTourIds(
        supabase,
        rows.map((row) => row.id),
    )

    return mapTourRowsToListItems(rows, slotsByTourId)
}
