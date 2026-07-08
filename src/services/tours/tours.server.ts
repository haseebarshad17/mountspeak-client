import {
    getAvailableSeats,
    isTourBookingClosed,
    isTourBookable,
} from '@/lib/booking/tour-booking-rules'
import { DEMO_BOOKING_TOUR_OPTION } from '@/lib/booking/demo-booking'
import { usesHajjUmrahBanner } from '@/lib/homepage/specialization'
import { createServerSupabase } from '@/lib/supabase/supabase.server'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'
import { umrahPlanService } from '@/services/umrah-plan/umrah-plan.service'
import { mapUmrahPlanRowsToListItems } from '@/services/umrah-plan/umrah-plan.utils'
import type { TourPage } from '@/components/pages/tour/sections/tour-page.types'

import { applyAgencyThemeToTourPage, mapTourRecordToPage } from './tours.mapper'
import type { TourSearchFilters } from './tours.search.types'
import { hasTourSearchFilters } from './tours.search.utils'
import type { UmrahSearchFilters } from './tours.umrah-search.utils'
import { hasUmrahSearchFilters } from './tours.umrah-search.utils'
import { toursService } from './tours.service'
import type { BookingTourOption } from '@/components/pages/booking/booking.types'

import { mapTourRowsToListItems } from './tour-seat-availability'

import type { TourListItem, TourRow } from './tours.types'

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

async function getServerSupabase() {
    return createServerSupabase()
}

async function getToursApi(scope: AgencyTourScope) {
    const supabase = await getServerSupabase()
    return toursService({
        supabase,
        agencyId: scope.agencyId ?? undefined,
    })
}

async function getUmrahPlansApi(scope: AgencyTourScope) {
    const supabase = await getServerSupabase()
    return umrahPlanService({
        supabase,
        agencyId: scope.agencyId ?? undefined,
    })
}

async function isUmrahAgencySite(): Promise<boolean> {
    const homepage = await fetchAgencyHomepage()
    return (
        homepage.isAgencySite &&
        usesHajjUmrahBanner(homepage.specializationId, homepage.specializations)
    )
}

async function mapRowsToTourListItems(rows: TourRow[]): Promise<TourListItem[]> {
    return mapTourRowsToListItems(rows)
}

export async function fetchPublishedTours(): Promise<TourListItem[]> {
    const scope = await getAgencyTourScope()
    if (!scope.isAgencySite) return []

    const tours = await getToursApi(scope)
    const rows = await tours.getPublishedTours()
    return mapRowsToTourListItems(rows)
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

    return mapRowsToTourListItems(rows)
}

export async function searchPublishedListings(
    filters: TourSearchFilters = {},
    umrahFilters: UmrahSearchFilters = {},
): Promise<TourListItem[]> {
    const scope = await getAgencyTourScope()
    if (!scope.isAgencySite) return []

    if (await isUmrahAgencySite()) {
        const plans = await getUmrahPlansApi(scope)
        const rows = hasUmrahSearchFilters(umrahFilters)
            ? await plans.searchPublishedPlans(umrahFilters)
            : await plans.getPublishedPlans()

        return mapUmrahPlanRowsToListItems(rows)
    }

    return searchPublishedTours(filters)
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

    const homepage = await fetchAgencyHomepage()
    const page = mapTourRecordToPage(row)

    return applyAgencyThemeToTourPage(page, homepage.page?.theme)
}

function toBookingTourOption(row: TourRow): BookingTourOption | null {
    if (row.price_per_seat == null || row.price_per_seat <= 0) return null

    const confirmedSeats = Math.max(0, row.confirmed_seats ?? 0)
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
    return rows
        .map((row) => toBookingTourOption(row))
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

        return toBookingTourOption(row)
    } catch {
        return null
    }
}
