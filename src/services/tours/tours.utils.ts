import { getAvailableSeats } from '@/lib/booking/tour-booking-rules'
import { DEMO_TOUR_DETAIL_PATH } from '@/lib/tours/default-tour-page'
import { TOUR_MEDIA_PLACEHOLDER, resolveTourMediaUrl } from '@/lib/supabase/tour-media'

import type { TourListItem, TourRow } from './tours.types'

export { DEMO_TOUR_DETAIL_PATH }

export function formatTourDiscountDisplayValue(
    percent: number | null | undefined,
): string | null {
    if (percent == null || Number.isNaN(Number(percent))) {
        return null
    }

    const value = Number(percent)
    if (value <= 0) return null

    if (Number.isInteger(value) || Math.abs(value - Math.round(value)) < 0.001) {
        return String(Math.round(value))
    }

    const rounded = Math.round(value * 10) / 10
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)
}

export function formatTourDiscount(percent: number | null | undefined): string {
    const value = formatTourDiscountDisplayValue(percent)
    if (!value) return ''

    return `${value}% Off`
}

export function getTourCoverImage(tour: Pick<TourRow, 'header' | 'overview' | 'visual_fragments'>): string {
    const hero = resolveTourMediaUrl(tour.header?.hero_image_url)
    if (hero) return hero

    const overview = resolveTourMediaUrl(tour.overview?.image_url)
    if (overview) return overview

    const fragment = tour.visual_fragments?.[0]
    const gallery = resolveTourMediaUrl(fragment)
    if (gallery) return gallery

    return TOUR_MEDIA_PLACEHOLDER
}

export function toTourListItem(
    tour: TourRow,
    confirmedSeats = 0,
): TourListItem {
    const totalBooked = confirmedSeats

    return {
        id: tour.id,
        slug: tour.slug,
        title: tour.title,
        discountLabel: formatTourDiscount(tour.discount_percent),
        discountPercent:
            tour.discount_percent == null || Number.isNaN(Number(tour.discount_percent))
                ? null
                : Number(tour.discount_percent),
        image: getTourCoverImage(tour),
        totalBooked,
        remainingSeats: getAvailableSeats(tour.capacity_total, totalBooked),
    }
}

export function tourDetailPath(slug: string, options?: { demo?: boolean }): string {
    if (options?.demo) {
        return DEMO_TOUR_DETAIL_PATH
    }

    return `/tours/${slug}`
}
