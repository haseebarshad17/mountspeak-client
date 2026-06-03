import { createServerSupabase } from '@/lib/supabase/supabase.server'
import type { TourPage } from '@/components/pages/tour/sections/tour-page.types'

import { mapTourRecordToPage } from './tours.mapper'
import type { TourSearchFilters } from './tours.search.types'
import { hasTourSearchFilters } from './tours.search.utils'
import { toursService } from './tours.service'
import type { BookingTourOption } from '@/components/pages/booking/booking.types'

import type { TourListItem, TourRow } from './tours.types'
import { toTourListItem } from './tours.utils'

async function getToursApi() {
    const supabase = await createServerSupabase()
    return toursService({ supabase })
}

export async function fetchPublishedTours(): Promise<TourListItem[]> {
    const tours = await getToursApi()
    const rows = await tours.getPublishedTours()
    return rows.map(toTourListItem)
}

export async function searchPublishedTours(
    filters: TourSearchFilters = {},
): Promise<TourListItem[]> {
    const tours = await getToursApi()
    const rows = hasTourSearchFilters(filters)
        ? await tours.searchPublishedTours(filters)
        : await tours.getPublishedTours()

    return rows.map(toTourListItem)
}

export async function fetchTourLocationOptions(): Promise<string[]> {
    const tours = await getToursApi()
    return tours.getPublishedTourLocations()
}

export async function fetchPublishedTourBySlug(slug: string): Promise<TourRow | null> {
    const tours = await getToursApi()
    return tours.getPublishedTourBySlug(slug)
}

export async function fetchTourPageBySlug(slug: string): Promise<TourPage | null> {
    const row = await fetchPublishedTourBySlug(slug)
    if (!row) return null
    return mapTourRecordToPage(row)
}

function toBookingTourOption(row: TourRow): BookingTourOption | null {
    if (row.price_per_seat == null || row.price_per_seat <= 0) return null

    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        agencyId: row.agency_id ?? 'unassigned',
        pricePerSeat: Number(row.price_per_seat),
        discountPercent: Number(row.discount_percent ?? 0),
        kidsDiscountPercent: Number(row.kids_discount ?? 0),
    }
}

export async function fetchPublishedToursForBooking(): Promise<BookingTourOption[]> {
    try {
        const tours = await getToursApi()
        const rows = await tours.getPublishedTours()

        return rows
            .map(toBookingTourOption)
            .filter((option): option is BookingTourOption => option !== null)
    } catch {
        return []
    }
}

export async function fetchBookingTourBySlug(slug: string): Promise<BookingTourOption | null> {
    try {
        const row = await fetchPublishedTourBySlug(slug)
        if (!row) return null
        return toBookingTourOption(row)
    } catch {
        return null
    }
}
