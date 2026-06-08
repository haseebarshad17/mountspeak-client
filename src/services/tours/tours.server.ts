import {
    getAvailableSeats,
    isTourBookingClosed,
    isTourBookable,
} from '@/lib/booking/tour-booking-rules'
import { DEMO_BOOKING_TOUR_OPTION } from '@/lib/booking/demo-booking'
import { createServerSupabase } from '@/lib/supabase/supabase.server'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'
import type { TourPage } from '@/components/pages/tour/sections/tour-page.types'

import { mapTourRecordToPage } from './tours.mapper'
import type { TourSearchFilters } from './tours.search.types'
import { hasTourSearchFilters } from './tours.search.utils'
import { toursService } from './tours.service'
import type { BookingTourOption } from '@/components/pages/booking/booking.types'

import type { TourListItem, TourRow } from './tours.types'
import { toTourListItem } from './tours.utils'

type AgencyTourScope = {
    isAgencySite: boolean
    agencyId: string | null
}

async function getAgencyTourScope(): Promise<AgencyTourScope> {
    const homepage = await fetchAgencyHomepage()

    return {
        isAgencySite: homepage.isAgencySite,
        agencyId: homepage.isAgencySite ? homepage.agencyId : null,
    }
}

async function getToursApi(scope: AgencyTourScope) {
    const supabase = await createServerSupabase()
    return toursService({
        supabase,
        agencyId: scope.agencyId ?? undefined,
    })
}

export async function fetchPublishedTours(): Promise<TourListItem[]> {
    const scope = await getAgencyTourScope()
    if (!scope.isAgencySite) return []

    const tours = await getToursApi(scope)
    const rows = await tours.getPublishedTours()
    return rows.map(toTourListItem)
}

export async function searchPublishedTours(
    filters: TourSearchFilters = {},
): Promise<TourListItem[]> {
    const scope = await getAgencyTourScope()
    if (!scope.isAgencySite) return []

    const tours = await getToursApi(scope)
    const rows = hasTourSearchFilters(filters)
        ? await tours.searchPublishedTours(filters)
        : await tours.getPublishedTours()

    return rows.map(toTourListItem)
}

export async function fetchTourLocationOptions(): Promise<string[]> {
    const scope = await getAgencyTourScope()
    if (!scope.isAgencySite) return []

    const tours = await getToursApi(scope)
    return tours.getPublishedTourLocations()
}

export async function fetchPublishedTourBySlug(slug: string): Promise<TourRow | null> {
    const scope = await getAgencyTourScope()
    if (!scope.isAgencySite) return null

    const tours = await getToursApi(scope)
    return tours.getPublishedTourBySlug(slug)
}

export async function fetchTourPageBySlug(slug: string): Promise<TourPage | null> {
    const row = await fetchPublishedTourBySlug(slug)
    if (!row) return null
    return mapTourRecordToPage(row)
}

const CONFIRMED_BOOKING_STATUSES = ['CONFIRMED', 'confirmed', 'Confirmed'] as const

type BookingSeatRow = {
    tour_id: string
    male_seat: number | null
    female_seat: number | null
    kids_seats: number | null
}

async function fetchConfirmedSeatsByTourId(
    tourIds: string[],
): Promise<Record<string, number>> {
    if (tourIds.length === 0) return {}

    const supabase = await createServerSupabase()
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

function toBookingTourOption(
    row: TourRow,
    confirmedSeatsByTourId: Record<string, number>,
): BookingTourOption | null {
    if (row.price_per_seat == null || row.price_per_seat <= 0) return null

    const confirmedSeats = confirmedSeatsByTourId[row.id] ?? 0
    const availableSeats = getAvailableSeats(row.capacity_total, confirmedSeats)
    const startDate = row.start_date ?? null
    const isBookingClosed = isTourBookingClosed(startDate)

    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        agencyId: row.agency_id ?? 'unassigned',
        pricePerSeat: Number(row.price_per_seat),
        discountPercent: Number(row.discount_percent ?? 0),
        kidsDiscountPercent: Number(row.kids_discount ?? 0),
        startDate,
        capacityTotal: row.capacity_total ?? null,
        confirmedSeats,
        availableSeats,
        isBookingClosed,
    }
}

async function mapRowsToBookingTourOptions(rows: TourRow[]): Promise<BookingTourOption[]> {
    const tourIds = rows.map((row) => row.id)
    const confirmedSeatsByTourId = await fetchConfirmedSeatsByTourId(tourIds)

    return rows
        .map((row) => toBookingTourOption(row, confirmedSeatsByTourId))
        .filter((option): option is BookingTourOption => option !== null)
        .filter((option) => isTourBookable(option))
}

export async function fetchPublishedToursForBooking(): Promise<BookingTourOption[]> {
    const scope = await getAgencyTourScope()
    if (!scope.isAgencySite) {
        return [DEMO_BOOKING_TOUR_OPTION]
    }

    try {
        const tours = await getToursApi(scope)
        const rows = await tours.getPublishedTours()
        return mapRowsToBookingTourOptions(rows)
    } catch {
        return []
    }
}

export async function fetchBookingTourBySlug(slug: string): Promise<BookingTourOption | null> {
    const scope = await getAgencyTourScope()
    if (!scope.isAgencySite) {
        if (slug === DEMO_BOOKING_TOUR_OPTION.slug) {
            return DEMO_BOOKING_TOUR_OPTION
        }
        return null
    }

    try {
        const row = await fetchPublishedTourBySlug(slug)
        if (!row) return null

        const confirmedSeatsByTourId = await fetchConfirmedSeatsByTourId([row.id])
        return toBookingTourOption(row, confirmedSeatsByTourId)
    } catch {
        return null
    }
}
