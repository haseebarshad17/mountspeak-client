import { isTourBookable } from '@/lib/booking/tour-booking-rules'
import { DEMO_BOOKING_TOUR_OPTION } from '@/lib/booking/demo-booking'
import {
    resolveListingSearchType,
    type ListingKind,
} from '@/lib/homepage/specialization'
import { createServerSupabase } from '@/lib/supabase/supabase.server'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'
import { internationalTourService } from '@/services/international-tour/international-tour.service'
import { mapInternationalTourRowsToListItems } from '@/services/international-tour/international-tour.utils'
import {
    mapInternationalTourToBookingOption,
    mapUmrahPlanToBookingOption,
} from '@/services/packages/package-booking.mapper'
import { mapPackagePlanToTourPage } from '@/services/packages/package-plan.mapper'
import { umrahPlanService } from '@/services/umrah-plan/umrah-plan.service'
import { mapUmrahPlanRowsToListItems } from '@/services/umrah-plan/umrah-plan.utils'
import type { TourPage } from '@/components/pages/tour/sections/tour-page.types'

import { applyAgencyThemeToTourPage, mapTourRecordToPage } from './tours.mapper'
import { mapTourPickupPointRow, type TourPickupPointRow } from './tours.pickup'
import type { TourSearchFilters } from './tours.search.types'
import { hasTourSearchFilters } from './tours.search.utils'
import type { UmrahSearchFilters } from './tours.umrah-search.utils'
import { hasUmrahSearchFilters } from './tours.umrah-search.utils'
import { toursService } from './tours.service'
import type { BookingTourOption } from '@/components/pages/booking/booking.types'
import { mapPublishedTourToBookingOption, type PublishedTourPickupPointRpc, type PublishedTourRpc, type PublishedTourSlotRpc } from './booking-tour.mapper'

import { mapTourRowsToListItemsWithSlots } from './tour-seat-availability'

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

async function getInternationalToursApi(scope: AgencyTourScope) {
    const supabase = await getServerSupabase()
    return internationalTourService({
        supabase,
        agencyId: scope.agencyId ?? undefined,
    })
}

async function resolveListingType(requestedType?: ListingKind | null): Promise<ListingKind> {
    const homepage = await fetchAgencyHomepage()
    return resolveListingSearchType(
        requestedType ?? null,
        homepage.specializationId,
        homepage.agencySpecializationIds,
        homepage.specializations,
    )
}

async function mapRowsToTourListItems(rows: TourRow[]): Promise<TourListItem[]> {
    const supabase = await getServerSupabase()
    return mapTourRowsToListItemsWithSlots(supabase, rows)
}

async function fetchPublishedTourRpc(slug: string, agencyId: string): Promise<PublishedTourRpc | null> {
    const supabase = await getServerSupabase()
    const { data, error } = await supabase.rpc('get_published_tour_by_slug', {
        p_slug: slug,
        p_agency_id: agencyId,
    })

    if (error) throw error
    if (!data || typeof data !== 'object') return null

    return data as PublishedTourRpc
}

function getUtcTodayDateString(): string {
    return new Date().toISOString().slice(0, 10)
}

function mapTourSlotRowToRpc(row: {
    id: string
    tour_id: string
    start_date: string
    end_date: string
    start_time: string
    end_time: string
    capacity_total: number
    confirmed_seats: number | null
    is_active: boolean
}): PublishedTourSlotRpc {
    const confirmedSeats = Math.max(0, row.confirmed_seats ?? 0)
    const today = getUtcTodayDateString()

    return {
        id: row.id,
        start_date: row.start_date,
        end_date: row.end_date,
        start_time: row.start_time?.slice(0, 5) ?? '00:00',
        end_time: row.end_time?.slice(0, 5) ?? '00:00',
        capacity_total: row.capacity_total,
        confirmed_seats: confirmedSeats,
        available_seats: Math.max(0, row.capacity_total - confirmedSeats),
        is_bookable: row.is_active && row.start_date > today,
    }
}

async function fetchPublishedTourSlotsByTourIds(
    tourIds: string[],
): Promise<Map<string, PublishedTourSlotRpc[]>> {
    const slotsByTourId = new Map<string, PublishedTourSlotRpc[]>()
    if (tourIds.length === 0) return slotsByTourId

    const supabase = await getServerSupabase()
    const { data, error } = await supabase
        .from('tour_slots')
        .select(
            'id, tour_id, start_date, end_date, start_time, end_time, capacity_total, confirmed_seats, is_active',
        )
        .in('tour_id', tourIds)
        .eq('is_active', true)
        .order('start_date', { ascending: true })
        .order('start_time', { ascending: true })

    if (error) throw error

    for (const row of data ?? []) {
        const mapped = mapTourSlotRowToRpc(row)
        const existing = slotsByTourId.get(row.tour_id) ?? []
        existing.push(mapped)
        slotsByTourId.set(row.tour_id, existing)
    }

    return slotsByTourId
}

async function fetchPublishedTourPickupPointsByTourIds(
    tourIds: string[],
): Promise<Map<string, ReturnType<typeof mapTourPickupPointRow>[]>> {
    const pointsByTourId = new Map<string, ReturnType<typeof mapTourPickupPointRow>[]>()
    if (tourIds.length === 0) return pointsByTourId

    const supabase = await getServerSupabase()
    const { data, error } = await supabase
        .from('tour_pickup_points')
        .select('id, tour_id, city, pickup_time, notes, sort_order, is_primary')
        .in('tour_id', tourIds)
        .order('sort_order', { ascending: true })
        .order('is_primary', { ascending: false })

    if (error) throw error

    for (const row of data ?? []) {
        const mapped = mapTourPickupPointRow(row as TourPickupPointRow)
        const existing = pointsByTourId.get(row.tour_id) ?? []
        existing.push(mapped)
        pointsByTourId.set(row.tour_id, existing)
    }

    return pointsByTourId
}

function toBookingTourOption(
    row: TourRow,
    slots: PublishedTourSlotRpc[] = [],
    pickupPoints: PublishedTourPickupPointRpc[] = [],
): BookingTourOption | null {
    return mapPublishedTourToBookingOption({
        id: row.id,
        agency_id: row.agency_id ?? '',
        slug: row.slug,
        title: row.title,
        price_per_seat: Number(row.price_per_seat),
        discount_percent: row.discount_percent,
        kids_discount: row.kids_discount,
        advance_amount_per_seat: row.advance_amount_per_seat ?? null,
        start_date: row.start_date,
        end_date: row.end_date,
        capacity_total: row.capacity_total,
        confirmed_seats: row.confirmed_seats,
        slots,
        pickup_points: pickupPoints,
    })
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
    requestedListingType?: ListingKind | null,
): Promise<TourListItem[]> {
    const scope = await getAgencyTourScope()
    if (!scope.isAgencySite) return []

    const listingType = await resolveListingType(requestedListingType)

    if (listingType === 'umrah') {
        const plans = await getUmrahPlansApi(scope)
        const rows = hasUmrahSearchFilters(umrahFilters)
            ? await plans.searchPublishedPlans(umrahFilters)
            : await plans.getPublishedPlans()

        return mapUmrahPlanRowsToListItems(rows)
    }

    if (listingType === 'international') {
        const tours = await getInternationalToursApi(scope)
        const rows = hasUmrahSearchFilters(umrahFilters)
            ? await tours.searchPublishedPlans(umrahFilters)
            : await tours.getPublishedPlans()

        return mapInternationalTourRowsToListItems(rows)
    }

    return searchPublishedTours(filters)
}

export async function fetchUmrahPackagePageById(planId: string): Promise<TourPage | null> {
    const scope = await getAgencyTourScope()
    if (!scope.isAgencySite) return null

    const plans = await getUmrahPlansApi(scope)
    const row = await plans.getPublishedPlanById(planId)
    if (!row) return null

    const homepage = await fetchAgencyHomepage()
    const page = mapPackagePlanToTourPage(row, 'umrah')
    return applyAgencyThemeToTourPage(page, homepage.page?.theme)
}

export async function fetchInternationalPackagePageById(planId: string): Promise<TourPage | null> {
    const scope = await getAgencyTourScope()
    if (!scope.isAgencySite) return null

    const tours = await getInternationalToursApi(scope)
    const row = await tours.getPublishedPlanById(planId)
    if (!row) return null

    const homepage = await fetchAgencyHomepage()
    const page = mapPackagePlanToTourPage(row, 'international')
    return applyAgencyThemeToTourPage(page, homepage.page?.theme)
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

    const pickupPointsByTourId = await fetchPublishedTourPickupPointsByTourIds([row.id])
    const pickupPoints = pickupPointsByTourId.get(row.id) ?? []

    const homepage = await fetchAgencyHomepage()
    const page = mapTourRecordToPage(row, pickupPoints)

    return applyAgencyThemeToTourPage(page, homepage.page?.theme)
}

async function mapRowsToBookingTourOptions(rows: TourRow[]): Promise<BookingTourOption[]> {
    const tourIds = rows.map((row) => row.id)
    const [slotsByTourId, pickupPointsByTourId] = await Promise.all([
        fetchPublishedTourSlotsByTourIds(tourIds),
        fetchPublishedTourPickupPointsByTourIds(tourIds),
    ])

    return rows
        .map((row) =>
            toBookingTourOption(
                row,
                slotsByTourId.get(row.id) ?? [],
                (pickupPointsByTourId.get(row.id) ?? []).map((point) => ({
                    id: point.id,
                    city: point.city,
                    pickup_time: point.pickupTime,
                    notes: point.notes,
                    sort_order: point.sortOrder,
                    is_primary: point.isPrimary,
                })),
            ),
        )
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

export async function fetchBookingTourBySlug(
    slug: string,
    preferredSlotId?: string | null,
): Promise<BookingTourOption | null> {
    const scope = await getAgencyTourScope()
    if (!scope.isAgencySite) {
        if (slug === DEMO_BOOKING_TOUR_OPTION.slug) {
            return DEMO_BOOKING_TOUR_OPTION
        }
        return null
    }

    if (!scope.agencyId) return null

    try {
        const rpcRow = await fetchPublishedTourRpc(slug, scope.agencyId)
        if (!rpcRow) return null

        const option = mapPublishedTourToBookingOption(rpcRow)
        if (!option) return null

        const hasSlots = option.slots.length > 0
        if (!hasSlots && !isTourBookable(option)) return null

        if (preferredSlotId) {
            const slot = option.slots.find((entry) => entry.id === preferredSlotId)
            if (slot?.isBookable && slot.availableSeats > 0) {
                return {
                    ...option,
                    startDate: slot.startDate,
                    availableSeats: slot.availableSeats,
                }
            }
        }

        return option
    } catch {
        return null
    }
}

export async function fetchBookingPackageById(
    kind: 'umrah' | 'international',
    id: string,
): Promise<BookingTourOption | null> {
    const scope = await getAgencyTourScope()
    if (!scope.isAgencySite || !scope.agencyId) return null

    try {
        if (kind === 'umrah') {
            const api = await getUmrahPlansApi(scope)
            const row = await api.getPublishedPlanById(id)
            const option = row ? mapUmrahPlanToBookingOption(row) : null
            return option && isTourBookable(option) ? option : null
        }

        const api = await getInternationalToursApi(scope)
        const row = await api.getPublishedPlanById(id)
        const option = row ? mapInternationalTourToBookingOption(row) : null
        return option && isTourBookable(option) ? option : null
    } catch {
        return null
    }
}
