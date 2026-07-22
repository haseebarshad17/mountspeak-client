import { isPackageBookingClosed } from '@/lib/booking/tour-booking-rules'
import { normalizeCurrencyCode } from '@/lib/money/format-money'
import { resolvePackageMediaUrlOrPlaceholder } from '@/lib/supabase/package-media'
import { packageDetailPath } from '@/services/tours/tours.utils'
import {
    formatTourDiscount,
    getTourDaysUntilStart,
} from '@/services/tours/tours.utils'
import type { TourListItem } from '@/services/tours/tours.types'
import type { UmrahSearchFilters } from '@/services/tours/tours.umrah-search.utils'

import type { UmrahPlanRow } from './umrah-plan.types'

function getUmrahPlanPricing(pricing: UmrahPlanRow['pricing']) {
    const original = Number(pricing?.original_price ?? 0)
    const discounted = Number(pricing?.discount_price ?? 0)
    const currency = normalizeCurrencyCode(pricing?.currency, 'umrah')

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

export function parseUmrahDurationDays(duration?: string): number | null {
    const match = duration?.trim().match(/^(\d+)/)
    return match ? Number(match[1]) : null
}

export function parseUmrahMinPassengers(passengers?: string): number | null {
    const value = passengers?.trim()
    if (!value) return null

    if (value.endsWith('+')) {
        const count = Number(value.replace('+', ''))
        return Number.isFinite(count) && count > 0 ? count : null
    }

    const count = Number(value)
    return Number.isFinite(count) && count > 0 ? count : null
}

export function normalizeUmrahPackageCategory(packageType?: string): string | null {
    const value = packageType?.trim()
    return value ? value.toUpperCase() : null
}

export function toUmrahPlanListItem(plan: UmrahPlanRow): TourListItem {
    const totalSeats = Math.max(0, plan.booking_info?.total_seats ?? 0)
    const availableSeats = plan.booking_info?.available_seats ?? null
    const totalBooked =
        totalSeats > 0 && availableSeats != null
            ? Math.max(0, totalSeats - availableSeats)
            : 0
    const departureDate = plan.duration_dates?.departure_date?.trim() || null
    const bookingDeadline = plan.booking_info?.booking_deadline?.trim() || null
    const { pricePerSeat, discountPercent, currency } = getUmrahPlanPricing(plan.pricing)

    return {
        id: plan.id,
        slug: plan.id,
        title: plan.basic_information?.package_title?.trim() || 'Umrah package',
        category: null,
        discountLabel: formatTourDiscount(discountPercent),
        discountPercent,
        pricePerSeat,
        currency,
        image: resolvePackageMediaUrlOrPlaceholder(plan.images?.featured_image, 'umrah'),
        totalBooked,
        remainingSeats: availableSeats,
        departureDate,
        daysLeft: getTourDaysUntilStart(departureDate),
        departureSlots: [],
        isBookingClosed: isPackageBookingClosed({ departureDate, bookingDeadline }),
        listingKind: 'umrah',
        detailHref: packageDetailPath('umrah', plan.id),
    }
}

export function mapUmrahPlanRowsToListItems(rows: UmrahPlanRow[]): TourListItem[] {
    return rows.map((row) => toUmrahPlanListItem(row))
}

export function filterUmrahPlansForSearch(
    rows: UmrahPlanRow[],
    filters: UmrahSearchFilters,
): UmrahPlanRow[] {
    const durationDays = parseUmrahDurationDays(filters.duration)
    const packageCategory = normalizeUmrahPackageCategory(filters.packageType)
    const minPassengers = parseUmrahMinPassengers(filters.passengers)

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
