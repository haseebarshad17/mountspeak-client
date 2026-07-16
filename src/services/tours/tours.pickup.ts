export type TourPickupPointRow = {
    id: string
    tour_id: string
    city: string
    pickup_time: string | null
    notes: string | null
    sort_order: number
    is_primary: boolean
}

export type TourPickupPoint = {
    id: string
    city: string
    pickupTime: string | null
    notes: string | null
    sortOrder: number
    isPrimary: boolean
}

export function mapTourPickupPointRow(row: TourPickupPointRow): TourPickupPoint {
    return {
        id: row.id,
        city: row.city,
        pickupTime: row.pickup_time?.slice(0, 5) ?? null,
        notes: row.notes,
        sortOrder: row.sort_order,
        isPrimary: row.is_primary,
    }
}

function formatPickupTime(value: string) {
    const [hours, minutes] = value.split(':')
    const hour = Number(hours)
    if (Number.isNaN(hour)) return value
    const suffix = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes ?? '00'} ${suffix}`
}

export function formatPickupPointLabel(point: Pick<TourPickupPoint, 'city' | 'pickupTime' | 'notes' | 'isPrimary'>) {
    const parts = [point.city]
    if (point.pickupTime) {
        parts.push(formatPickupTime(point.pickupTime))
    }
    if (point.isPrimary) {
        parts.push('Main departure')
    }
    if (point.notes?.trim()) {
        parts.push(point.notes.trim())
    }
    return parts.join(' · ')
}

export function formatPickupTimeDisplay(value: string | null | undefined) {
    if (!value) return null
    return formatPickupTime(value)
}

export function getTourPickupCities(points: TourPickupPoint[]): string[] {
    return [...new Set(points.map((point) => point.city.trim()).filter(Boolean))]
}

export function tourMatchesPickupCity(
    searchCity: string,
    fromLocation: string | null | undefined,
    pickupCities: string[],
): boolean {
    const normalized = searchCity.trim().toLowerCase()
    if (!normalized) return true

    if (fromLocation?.trim().toLowerCase() === normalized) return true

    return pickupCities.some((city) => city.trim().toLowerCase() === normalized)
}
