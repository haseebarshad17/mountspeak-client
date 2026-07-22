export type InternationalTourRow = {
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
        currency?: string | null
    } | null
    duration_dates: {
        departure_date?: string | null
        duration_days?: number | null
    } | null
    booking_info: {
        total_seats?: number | null
        available_seats?: number | null
        booking_deadline?: string | null
    } | null
    images: {
        featured_image?: string | null
        gallery_images?: string[] | null
    } | null
    descriptions?: {
        short_description?: string | null
        detailed_description?: string | null
    } | null
    seo?: {
        meta_title?: string | null
        meta_description?: string | null
        meta_keywords?: string | null
    } | null
    created_at: string
}

export const INTERNATIONAL_TOUR_STATUS = {
    active: 'ACTIVE',
} as const
