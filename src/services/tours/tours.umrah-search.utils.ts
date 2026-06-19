export type UmrahSearchFilters = {
    duration?: string
    passengers?: string
    packageType?: string
}

export function buildUmrahSearchPath(filters: UmrahSearchFilters): string {
    const search = new URLSearchParams()

    if (filters.duration?.trim()) search.set('duration', filters.duration.trim())
    if (filters.passengers?.trim()) search.set('passengers', filters.passengers.trim())
    if (filters.packageType?.trim()) search.set('packageType', filters.packageType.trim())

    const query = search.toString()
    return query ? `/search?${query}` : '/search'
}

export function parseUmrahSearchParams(
    params: Record<string, string | string[] | undefined>,
): UmrahSearchFilters {
    const pick = (key: string) => {
        const value = params[key]
        if (Array.isArray(value)) return value[0]?.trim() ?? ''
        return value?.trim() ?? ''
    }

    return {
        duration: pick('duration') || undefined,
        passengers: pick('passengers') || undefined,
        packageType: pick('packageType') || undefined,
    }
}

export function hasUmrahSearchFilters(filters: UmrahSearchFilters): boolean {
    return Boolean(filters.duration || filters.passengers || filters.packageType)
}

export function formatUmrahSearchSummary(filters: UmrahSearchFilters): string | null {
    const parts: string[] = []

    if (filters.duration) parts.push(`Duration ${filters.duration}`)
    if (filters.passengers) parts.push(`${filters.passengers} passenger${filters.passengers === '1' ? '' : 's'}`)
    if (filters.packageType) parts.push(`${filters.packageType} package`)

    return parts.length > 0 ? parts.join(' · ') : null
}
