import type { TourSearchFilters } from './tours.search.types'
import type { TourRow } from './tours.types'

export function parseTourSearchParams(
    params: Record<string, string | string[] | undefined>,
): TourSearchFilters {
    const pick = (key: string) => {
        const value = params[key]
        if (Array.isArray(value)) return value[0]?.trim() ?? ''
        return value?.trim() ?? ''
    }

    return {
        from: pick('from') || undefined,
        to: pick('to') || undefined,
        date: pick('date') || undefined,
    }
}

export function buildTourSearchPath(filters: TourSearchFilters): string {
    const search = new URLSearchParams()

    if (filters.from?.trim()) search.set('from', filters.from.trim())
    if (filters.to?.trim()) search.set('to', filters.to.trim())
    if (filters.date?.trim()) search.set('date', filters.date.trim())

    const query = search.toString()
    return query ? `/search?${query}` : '/search'
}

export function formatTourSearchSummary(filters: TourSearchFilters): string | null {
    const parts: string[] = []

    if (filters.from) parts.push(`From ${filters.from}`)
    if (filters.to) parts.push(`To ${filters.to}`)
    if (filters.date) {
        const formatted = new Date(filters.date).toLocaleDateString('en-PK', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        })
        parts.push(`Date ${formatted}`)
    }

    return parts.length > 0 ? parts.join(' · ') : null
}

export function hasTourSearchFilters(filters: TourSearchFilters): boolean {
    return Boolean(filters.from || filters.to || filters.date)
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
