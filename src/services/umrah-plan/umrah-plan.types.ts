export type UmrahPlanRow = {
    id: string
    agency_id: string | null
    basic_information: {
        package_title?: string | null
        package_status?: string | null
        package_category?: string | null
    } | null
    pricing: {
        original_price?: number | null
        discount_price?: number | null
    } | null
    duration_dates: {
        departure_date?: string | null
        duration_days?: number | null
    } | null
    booking_info: {
        total_seats?: number | null
        available_seats?: number | null
    } | null
    images: {
        featured_image?: string | null
    } | null
    created_at: string
}

export const UMRAH_PLAN_STATUS = {
    active: 'ACTIVE',
} as const
