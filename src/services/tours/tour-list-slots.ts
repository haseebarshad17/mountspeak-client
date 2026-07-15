import type { SupabaseClient } from '@supabase/supabase-js'

import type { TourListDepartureSlot } from './tours.types'

type TourSlotRow = {
    id: string
    tour_id: string
    start_date: string
    start_time: string
    capacity_total: number
    confirmed_seats: number | null
    is_active: boolean
}

function getUtcTodayDateString(): string {
    return new Date().toISOString().slice(0, 10)
}

export function mapTourSlotRowToListDeparture(row: TourSlotRow): TourListDepartureSlot {
    const confirmedSeats = Math.max(0, row.confirmed_seats ?? 0)
    const availableSeats = Math.max(0, row.capacity_total - confirmedSeats)
    const today = getUtcTodayDateString()

    return {
        id: row.id,
        startDate: row.start_date,
        startTime: row.start_time?.slice(0, 5) ?? '00:00',
        availableSeats,
        isBookable: row.is_active && row.start_date > today && availableSeats > 0,
    }
}

export async function fetchTourListDepartureSlotsByTourIds(
    supabase: SupabaseClient,
    tourIds: string[],
): Promise<Map<string, TourListDepartureSlot[]>> {
    const slotsByTourId = new Map<string, TourListDepartureSlot[]>()
    if (tourIds.length === 0) return slotsByTourId

    const { data, error } = await supabase
        .from('tour_slots')
        .select('id, tour_id, start_date, start_time, capacity_total, confirmed_seats, is_active')
        .in('tour_id', tourIds)
        .eq('is_active', true)
        .order('start_date', { ascending: true })
        .order('start_time', { ascending: true })

    if (error) throw error

    for (const row of (data ?? []) as TourSlotRow[]) {
        const mapped = mapTourSlotRowToListDeparture(row)
        const existing = slotsByTourId.get(row.tour_id) ?? []
        existing.push(mapped)
        slotsByTourId.set(row.tour_id, existing)
    }

    return slotsByTourId
}
