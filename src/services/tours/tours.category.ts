export type TourCategory = 'PUBLIC_TRIP' | 'HONEYMOON'

export const TOUR_CATEGORY_VALUES = ['PUBLIC_TRIP', 'HONEYMOON'] as const

export const TOUR_CATEGORY_LABELS: Record<TourCategory, string> = {
    PUBLIC_TRIP: 'Public trip',
    HONEYMOON: 'Honeymoon',
}

export const TOUR_CATEGORY_FILTER_OPTIONS = [
    { value: '', label: 'All categories' },
    { value: 'PUBLIC_TRIP', label: 'Public trip' },
    { value: 'HONEYMOON', label: 'Honeymoon' },
] as const

export function normalizeTourCategory(value: string | null | undefined): TourCategory | undefined {
    const normalized = value?.trim().toUpperCase()
    if (normalized === 'PUBLIC_TRIP' || normalized === 'HONEYMOON') {
        return normalized
    }
    return undefined
}

export function getTourCategoryLabel(category: TourCategory | null | undefined): string | null {
    if (!category) return null
    return TOUR_CATEGORY_LABELS[category] ?? null
}
