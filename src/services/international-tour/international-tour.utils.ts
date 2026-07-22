import { isPackageBookingClosed } from '@/lib/booking/tour-booking-rules'
import { normalizeCurrencyCode } from '@/lib/money/format-money'
import { resolvePackageMediaUrlOrPlaceholder } from '@/lib/supabase/package-media'
import {
    formatTourDiscount,
    getTourDaysUntilStart,
} from '@/services/tours/tours.utils'
import type { TourListItem } from '@/services/tours/tours.types'
import { packageDetailPath } from '@/services/tours/tours.utils'
import type { UmrahSearchFilters } from '@/services/tours/tours.umrah-search.utils'

import type { InternationalTourRow } from './international-tour.types'

function getInternationalTourPricing(pricing: InternationalTourRow['pricing']) {
    const original = Number(pricing?.original_price ?? 0)
    const discounted = Number(pricing?.discount_price ?? 0)
    const currency = normalizeCurrencyCode(pricing?.currency, 'international')

    if (original > 0 && discounted > 0 && discounted < original) {
        return {
            pricePerSeat: original,
            discountPercent: Math.round(((original - discounted) / original) * 100),
            currency,
        }
    }

    if (original > 0) {
        return { pricePerSeat: original, discountPercent: null, currency }
    }

    return { pricePerSeat: null, discountPercent: null, currency }
}

export function parseInternationalDurationDays(duration?: string): number | null {
    const match = duration?.trim().match(/^(\d+)/)
    return match ? Number(match[1]) : null
}

export function parseInternationalMinPassengers(passengers?: string): number | null {
    const value = passengers?.trim()
    if (!value) return null

    if (value.endsWith('+')) {
        const count = Number(value.replace('+', ''))
        return Number.isFinite(count) && count > 0 ? count : null
    }

    const count = Number(value)
    return Number.isFinite(count) && count > 0 ? count : null
}

export function normalizeInternationalPackageCategory(packageType?: string): string | null {
    const value = packageType?.trim()
    return value ? value.toUpperCase() : null
}

export function toInternationalTourListItem(plan: InternationalTourRow): TourListItem {
    const totalSeats = Math.max(0, plan.booking_info?.total_seats ?? 0)
    const availableSeats = plan.booking_info?.available_seats ?? null
    const totalBooked =
        totalSeats > 0 && availableSeats != null
            ? Math.max(0, totalSeats - availableSeats)
            : 0
    const departureDate = plan.duration_dates?.departure_date?.trim() || null
    const bookingDeadline = plan.booking_info?.booking_deadline?.trim() || null
    const { pricePerSeat, discountPercent, currency } = getInternationalTourPricing(plan.pricing)

    return {
        id: plan.id,
        slug: plan.id,
        title: plan.basic_information?.package_title?.trim() || 'International package',
        category: null,
        discountLabel: formatTourDiscount(discountPercent),
        discountPercent,
        pricePerSeat,
        currency,
        image: resolvePackageMediaUrlOrPlaceholder(plan.images?.featured_image, 'international'),
        totalBooked,
        remainingSeats: availableSeats,
        departureDate,
        daysLeft: getTourDaysUntilStart(departureDate),
        departureSlots: [],
        isBookingClosed: isPackageBookingClosed({ departureDate, bookingDeadline }),
        listingKind: 'international',
        detailHref: packageDetailPath('international', plan.id),
    }
}

export function mapInternationalTourRowsToListItems(rows: InternationalTourRow[]): TourListItem[] {
    return rows.map((row) => toInternationalTourListItem(row))
}

export function filterInternationalToursForSearch(
    rows: InternationalTourRow[],
    filters: UmrahSearchFilters,
): InternationalTourRow[] {
    const durationDays = parseInternationalDurationDays(filters.duration)
    const packageCategory = normalizeInternationalPackageCategory(filters.packageType)
    const minPassengers = parseInternationalMinPassengers(filters.passengers)

    return rows.filter((row) => {
        if (durationDays != null && row.duration_dates?.duration_days !== durationDays) {
            return false
        }

        if (
            packageCategory &&
            row.basic_information?.package_category?.trim().toUpperCase() !== packageCategory
        ) {
            return false
        }

        if (minPassengers != null) {
            const available = row.booking_info?.available_seats
            if (available == null || available < minPassengers) return false
        }

        return true
    })
}
