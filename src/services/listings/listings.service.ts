import type { SupabaseClient } from '@supabase/supabase-js'
import type { SpecializationKind } from '@/services/specialization/specialization.types'
import { isValidAgencyId } from '@/services/specialization/specialization.service'
import {
    mapInternationalTourToListing,
    mapTourToDetail,
    mapTourToListing,
    mapUmrahPlanToListing,
} from './listings.mappers'
import type {
    InternationalTourRow,
    ListingItem,
    ListingSearchFilters,
    TourDetail,
    TourRow,
    UmrahPlanRow,
} from './listings.types'

const TOUR_DETAIL_COLUMNS =
    'id, agency_id, title, start_date, end_date, price_per_seat, capacity_total, publication_status, from_location, to_location, discount_percent, slug, header, overview, highlights, route, places_visited, journey, stay_and_dine, expedition_perks, visual_fragments, kids_discount, confirmed_seats, category, advance_amount_per_seat'

const UMRAH_DESTINATIONS = ['Makkah', 'Madinah', 'Jeddah'] as const

const INTERNATIONAL_DESTINATIONS = [
    'Dubai',
    'Turkey',
    'Thailand',
    'Malaysia',
    'Singapore',
    'Maldives',
    'Azerbaijan',
    'Vietnam',
    'Europe',
] as const

function matchesDestination(item: ListingItem, destination?: string | null) {
    if (!destination?.trim()) return true
    const q = destination.trim().toLowerCase()
    return (
        item.location.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q)
    )
}

function matchesDeparture(item: ListingItem, departureDate?: string | null) {
    if (!departureDate?.trim()) return true
    if (!item.departureDate) return true
    return item.departureDate >= departureDate
}

function matchesTravelers(item: ListingItem, travelers?: number | null) {
    if (!travelers || travelers <= 0) return true
    if (item.travelersCapacity == null) return true
    return item.travelersCapacity >= travelers
}

function applyClientFilters(
    items: ListingItem[],
    filters: ListingSearchFilters
): ListingItem[] {
    let next = items.filter(
        (item) =>
            matchesDestination(item, filters.destination) &&
            matchesDeparture(item, filters.departureDate) &&
            matchesTravelers(item, filters.travelers)
    )

    if (filters.featuredOnly) {
        const featured = next.filter((item) => item.featured)
        if (featured.length > 0) next = featured
    }

    if (filters.limit && filters.limit > 0) {
        next = next.slice(0, filters.limit)
    }

    return next
}

export function getListingsService({ supabase }: { supabase: SupabaseClient }) {
    return {
        async getTours(agencyId: string): Promise<ListingItem[]> {
            if (!isValidAgencyId(agencyId)) return []

            const { data, error } = await supabase
                .from('tours')
                .select(
                    'id, agency_id, title, start_date, end_date, price_per_seat, capacity_total, publication_status, from_location, to_location, discount_percent, slug, header, category, confirmed_seats'
                )
                .eq('agency_id', agencyId)
                .eq('publication_status', 'PUBLISHED')
                .order('updated_at', { ascending: false })

            if (error) throw error
            return ((data as TourRow[] | null) ?? []).map(mapTourToListing)
        },

        async getUmrahPlans(agencyId: string): Promise<ListingItem[]> {
            if (!isValidAgencyId(agencyId)) return []

            const { data, error } = await supabase
                .from('umrah_plan')
                .select(
                    'id, agency_id, basic_information, pricing, duration_dates, descriptions, images, booking_info, makkah_hotel, madinah_hotel'
                )
                .eq('agency_id', agencyId)
                .order('updated_at', { ascending: false })

            if (error) throw error

            return ((data as UmrahPlanRow[] | null) ?? [])
                .filter(
                    (row) =>
                        (row.basic_information?.package_status ?? 'ACTIVE').toUpperCase() ===
                        'ACTIVE'
                )
                .map(mapUmrahPlanToListing)
        },

        async getInternationalTours(agencyId: string): Promise<ListingItem[]> {
            if (!isValidAgencyId(agencyId)) return []

            const { data, error } = await supabase
                .from('international_tour')
                .select(
                    'id, agency_id, basic_information, pricing, duration_dates, descriptions, images, booking_info'
                )
                .eq('agency_id', agencyId)
                .order('updated_at', { ascending: false })

            if (error) throw error

            return ((data as InternationalTourRow[] | null) ?? [])
                .filter(
                    (row) =>
                        (row.basic_information?.package_status ?? 'ACTIVE').toUpperCase() ===
                        'ACTIVE'
                )
                .map(mapInternationalTourToListing)
        },

        async getListingsByKind(
            agencyId: string,
            kind: SpecializationKind,
            filters: ListingSearchFilters = {}
        ): Promise<ListingItem[]> {
            let items: ListingItem[] = []
            try {
                if (kind === 'tours') items = await this.getTours(agencyId)
                if (kind === 'packages') items = await this.getUmrahPlans(agencyId)
                if (kind === 'international') {
                    items = await this.getInternationalTours(agencyId)
                }
            } catch {
                items = []
            }
            return applyClientFilters(items, { ...filters, kind })
        },

        async getFeaturedListingsByKind(
            agencyId: string,
            kind: SpecializationKind,
            limit = 6
        ): Promise<ListingItem[]> {
            return this.getListingsByKind(agencyId, kind, {
                featuredOnly: true,
                limit,
            })
        },

        async getTourBySlugOrId(
            agencyId: string,
            slugOrId: string
        ): Promise<TourDetail | null> {
            if (!isValidAgencyId(agencyId) || !slugOrId.trim()) return null

            const bySlug = await supabase
                .from('tours')
                .select(TOUR_DETAIL_COLUMNS)
                .eq('agency_id', agencyId)
                .eq('publication_status', 'PUBLISHED')
                .eq('slug', slugOrId)
                .maybeSingle()

            if (bySlug.error) throw bySlug.error
            if (bySlug.data) return mapTourToDetail(bySlug.data as TourRow)

            const byId = await supabase
                .from('tours')
                .select(TOUR_DETAIL_COLUMNS)
                .eq('agency_id', agencyId)
                .eq('publication_status', 'PUBLISHED')
                .eq('id', slugOrId)
                .maybeSingle()

            if (byId.error) throw byId.error
            if (!byId.data) return null
            return mapTourToDetail(byId.data as TourRow)
        },

        async getDestinationOptions(
            agencyId: string,
            kind: SpecializationKind
        ): Promise<string[]> {
            if (kind === 'packages') return [...UMRAH_DESTINATIONS]
            if (kind === 'international') return [...INTERNATIONAL_DESTINATIONS]

            try {
                const tours = await this.getTours(agencyId)
                const set = new Set<string>()
                for (const tour of tours) {
                    for (const part of tour.location.split(/→|,|\//)) {
                        const value = part.trim()
                        if (value) set.add(value)
                    }
                }
                const cities = [...set].sort((a, b) => a.localeCompare(b))
                return cities.length > 0
                    ? cities
                    : ['Hunza', 'Skardu', 'Swat', 'Naran', 'Murree']
            } catch {
                return ['Hunza', 'Skardu', 'Swat', 'Naran', 'Murree']
            }
        },

        async getPackageListingTitle(
            agencyId: string,
            kind: 'umrah' | 'international',
            id: string
        ): Promise<string> {
            if (!isValidAgencyId(agencyId) || !id.trim()) {
                return kind === 'umrah' ? 'Umrah package' : 'International tour'
            }

            if (kind === 'umrah') {
                const { data, error } = await supabase
                    .from('umrah_plan')
                    .select('basic_information')
                    .eq('agency_id', agencyId)
                    .eq('id', id)
                    .maybeSingle()
                if (error) throw error
                const title = (
                    data?.basic_information as { package_title?: string } | null
                )?.package_title
                return title?.trim() || 'Umrah package'
            }

            const { data, error } = await supabase
                .from('international_tour')
                .select('basic_information')
                .eq('agency_id', agencyId)
                .eq('id', id)
                .maybeSingle()
            if (error) throw error
            const title = (
                data?.basic_information as { package_title?: string } | null
            )?.package_title
            return title?.trim() || 'International tour'
        },
    }
}

export async function getListingsByKind({
    supabase,
    agencyId,
    kind,
    filters,
}: {
    supabase: SupabaseClient
    agencyId: string
    kind: SpecializationKind
    filters?: ListingSearchFilters
}) {
    return getListingsService({ supabase }).getListingsByKind(
        agencyId,
        kind,
        filters
    )
}

export async function getFeaturedListingsByKind({
    supabase,
    agencyId,
    kind,
    limit = 6,
}: {
    supabase: SupabaseClient
    agencyId: string
    kind: SpecializationKind
    limit?: number
}) {
    return getListingsService({ supabase }).getFeaturedListingsByKind(
        agencyId,
        kind,
        limit
    )
}

export async function getDestinationOptions({
    supabase,
    agencyId,
    kind,
}: {
    supabase: SupabaseClient
    agencyId: string
    kind: SpecializationKind
}) {
    return getListingsService({ supabase }).getDestinationOptions(agencyId, kind)
}

export async function getTourBySlugOrId({
    supabase,
    agencyId,
    slugOrId,
}: {
    supabase: SupabaseClient
    agencyId: string
    slugOrId: string
}): Promise<TourDetail | null> {
    try {
        return await getListingsService({ supabase }).getTourBySlugOrId(
            agencyId,
            slugOrId
        )
    } catch {
        return null
    }
}

export async function getPackageListingTitle({
    supabase,
    agencyId,
    kind,
    id,
    fallback,
}: {
    supabase: SupabaseClient
    agencyId: string
    kind: 'umrah' | 'international'
    id: string
    fallback?: string | null
}): Promise<string> {
    if (fallback?.trim()) return fallback.trim()
    try {
        return await getListingsService({ supabase }).getPackageListingTitle(
            agencyId,
            kind,
            id
        )
    } catch {
        return kind === 'umrah' ? 'Umrah package' : 'International tour'
    }
}

export async function getAgencyListingsBundle({
    supabase,
    agencyId,
}: {
    supabase: SupabaseClient
    agencyId: string
}): Promise<Record<SpecializationKind, ListingItem[]>> {
    if (!isValidAgencyId(agencyId)) {
        return { tours: [], packages: [], international: [] }
    }

    const service = getListingsService({ supabase })
    const [tours, packages, international] = await Promise.all([
        service.getFeaturedListingsByKind(agencyId, 'tours', 6).catch(() => []),
        service.getFeaturedListingsByKind(agencyId, 'packages', 6).catch(() => []),
        service
            .getFeaturedListingsByKind(agencyId, 'international', 6)
            .catch(() => []),
    ])

    return { tours, packages, international }
}
