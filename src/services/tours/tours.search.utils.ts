import type { TourSearchFilters } from './tours.search.types'
import type { TourRow } from './tours.types'

function formatSearchDateLabel(value: string): string {
    return new Date(value).toLocaleDateString('en-PK', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

export function parseTourSearchParams(
    params: Record<string, string | string[] | undefined>,
): TourSearchFilters {
    const pick = (key: string) => {
        const value = params[key]
        if (Array.isArray(value)) return value[0]?.trim() ?? ''
        return value?.trim() ?? ''
    }

    const legacyDate = pick('date')

    return {
        from: pick('from') || undefined,
        to: pick('to') || undefined,
        start_date: pick('start_date') || legacyDate || undefined,
        end_date: pick('end_date') || legacyDate || undefined,
    }
}

export function buildTourSearchPath(filters: TourSearchFilters): string {
    const search = new URLSearchParams()

    if (filters.from?.trim()) search.set('from', filters.from.trim())
    if (filters.to?.trim()) search.set('to', filters.to.trim())
    if (filters.start_date?.trim()) search.set('start_date', filters.start_date.trim())
    if (filters.end_date?.trim()) search.set('end_date', filters.end_date.trim())

    const query = search.toString()
    return query ? `/search?${query}` : '/search'
}

export function formatTourSearchSummary(filters: TourSearchFilters): string | null {
    const parts: string[] = []

    if (filters.from) parts.push(`From ${filters.from}`)
    if (filters.to) parts.push(`To ${filters.to}`)

    if (filters.start_date && filters.end_date) {
        parts.push(
            `${formatSearchDateLabel(filters.start_date)} – ${formatSearchDateLabel(filters.end_date)}`,
        )
    } else if (filters.start_date) {
        parts.push(`From ${formatSearchDateLabel(filters.start_date)}`)
    } else if (filters.end_date) {
        parts.push(`Until ${formatSearchDateLabel(filters.end_date)}`)
    }

    return parts.length > 0 ? parts.join(' · ') : null
}

export function hasTourSearchFilters(filters: TourSearchFilters): boolean {
    return Boolean(filters.from || filters.to || filters.start_date || filters.end_date)
}

export function normalizeTourLocation(value: string | null | undefined): string {
    return value?.trim().toLowerCase() ?? ''
}

export function isExactTourLocationMatch(
    searchValue: string,
    tourValue: string | null | undefined,
): boolean {
    return normalizeTourLocation(searchValue) === normalizeTourLocation(tourValue)
}

export function tourMatchesDateFilter(
    tour: Pick<TourRow, 'start_date' | 'end_date'>,
    filters: Pick<TourSearchFilters, 'start_date' | 'end_date'>,
): boolean {
    const tourStart = tour.start_date?.trim()
    const tourEnd = tour.end_date?.trim()

    if (!tourStart || !tourEnd) return false

    const userStart = filters.start_date?.trim()
    const userEnd = filters.end_date?.trim()

    if (!userStart && !userEnd) return true

    if (userStart && userEnd) {
        return tourStart <= userEnd && tourEnd >= userStart
    }

    const singleDate = userStart ?? userEnd!
    return tourStart <= singleDate && tourEnd >= singleDate
}

/**
 * When both from and to are set, only tours on that exact route are returned.
 * Date filters require overlap with the tour's published date range.
 */
export function filterToursForSearch(tours: TourRow[], filters: TourSearchFilters): TourRow[] {
    const from = filters.from?.trim()
    const to = filters.to?.trim()

    let result = tours

    if (from && to) {
        result = result.filter(
            (tour) =>
                isExactTourLocationMatch(from, tour.from_location) &&
                isExactTourLocationMatch(to, tour.to_location),
        )
    }

    if (filters.start_date || filters.end_date) {
        result = result.filter((tour) => tourMatchesDateFilter(tour, filters))
    }

    if (from || to) {
        return sortToursForSearch(result, filters)
    }

    return result
}

/**
 * Lower rank = higher priority.
 * When from+to: exact route first, then other tours from the same departure city.
 */
export function getTourSearchRank(tour: TourRow, filters: TourSearchFilters): number {
    const from = filters.from?.trim()
    const to = filters.to?.trim()

    if (from && to) {
        const exactFrom = isExactTourLocationMatch(from, tour.from_location)
        const exactTo = isExactTourLocationMatch(to, tour.to_location)

        if (exactFrom && exactTo) return 0
        if (exactFrom) return 1
        return 2
    }

    if (from) {
        return isExactTourLocationMatch(from, tour.from_location) ? 0 : 1
    }

    if (to) {
        return isExactTourLocationMatch(to, tour.to_location) ? 0 : 1
    }

    return 0
}

export function sortToursForSearch(tours: TourRow[], filters: TourSearchFilters): TourRow[] {
    return [...tours].sort((a, b) => {
        const rankDiff = getTourSearchRank(a, filters) - getTourSearchRank(b, filters)
        if (rankDiff !== 0) return rankDiff

        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
}