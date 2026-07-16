import { getAvailableSeats, isTourBookingClosed, parseTourCalendarDate } from '@/lib/booking/tour-booking-rules'
import { DEMO_TOUR_DETAIL_PATH } from '@/lib/tours/default-tour-page'
import { TOUR_MEDIA_PLACEHOLDER, resolveTourMediaUrl } from '@/lib/supabase/tour-media'

import { normalizeTourCategory } from './tours.category'
import type { TourListDepartureSlot, TourListItem, TourRow } from './tours.types'

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

    return `${value}% off`
}

export function formatTourPrice(amount: number): string {
    return `PKR ${amount.toLocaleString('en-PK')}`
}

export function getTourDiscountedPricePerSeat(
    pricePerSeat: number,
    discountPercent: number | null | undefined,
): number {
    const percent = discountPercent ?? 0
    if (percent <= 0) return Math.round(pricePerSeat)

    return Math.round(pricePerSeat - (percent / 100) * pricePerSeat)
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

export function getTourSeatCounts(tour: Pick<TourRow, 'capacity_total' | 'confirmed_seats'>) {
    const confirmedSeats = Math.max(0, tour.confirmed_seats ?? 0)

    return {
        totalBooked: confirmedSeats,
        remainingSeats: getAvailableSeats(tour.capacity_total, confirmedSeats),
        confirmedSeats,
    }
}

/** Newest tours first; `created_at` is the publish-order proxy (no `published_at` column). */
export function sortToursByLatestPublished(tours: TourRow[]): TourRow[] {
    return [...tours].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
}

/** Calendar date from a tours `start_date` / `end_date` value (`date` or ISO timestamp). */
export { parseTourCalendarDate } from '@/lib/booking/tour-booking-rules'

export function getTourDaysUntilStart(startDate: string | null | undefined): number | null {
    const start = parseTourCalendarDate(startDate)
    if (!start) return null

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const diffDays = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays < 0) return null

    return diffDays
}

export function getTourDepartureDate(
    tour: Pick<TourRow, 'start_date' | 'end_date'>,
): string | null {
    const startDate = tour.start_date?.trim()
    if (startDate) return startDate

    const endDate = tour.end_date?.trim()
    return endDate || null
}

export function formatTourCardDateLabel(date: string | null | undefined): string | null {
    const parsed = parseTourCalendarDate(date)
    if (!parsed) return null

    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
    }).format(parsed)
}

export function formatTourDaysLeft(
    daysLeft: number | null | undefined,
    departureDate?: string | null,
): string | null {
    if (daysLeft == null) return null

    const dateLabel = formatTourCardDateLabel(departureDate)
    const daysPart =
        daysLeft === 0 ? 'Last day to book' : daysLeft === 1 ? '1 day left' : `${daysLeft} days left`

    if (!dateLabel) return daysPart

    return `${daysPart} from ${dateLabel}`
}

export function formatTourListSlotTime(time: string | null | undefined): string | null {
    const normalized = time?.slice(0, 5)
    if (!normalized || normalized === '00:00') return null

    const parsed = new Date(`1970-01-01T${normalized}:00`)
    if (Number.isNaN(parsed.getTime())) return normalized

    return parsed.toLocaleTimeString('en-PK', {
        hour: 'numeric',
        minute: '2-digit',
    })
}

export function formatTourListSlotLabel(
    slot: Pick<TourListDepartureSlot, 'startDate' | 'startTime'>,
): string {
    const dateLabel = formatTourCardDateLabel(slot.startDate)
    const timeLabel = formatTourListSlotTime(slot.startTime)

    if (dateLabel && timeLabel) return `${dateLabel} · ${timeLabel}`
    return dateLabel ?? slot.startDate
}

export function formatTourListSlotAvailability(availableSeats: number): string {
    return `${availableSeats} seat${availableSeats === 1 ? '' : 's'} left`
}

export function toTourListItem(tour: TourRow, departureSlots: TourListDepartureSlot[] = []): TourListItem {
    const { totalBooked, remainingSeats } = getTourSeatCounts(tour)
    const hasSlots = departureSlots.length > 0
    const bookableSlots = departureSlots.filter((slot) => slot.isBookable)
    const nearestBookableSlot = bookableSlots[0] ?? departureSlots[0] ?? null
    const departureDate = hasSlots
        ? (nearestBookableSlot?.startDate ?? getTourDepartureDate(tour))
        : getTourDepartureDate(tour)

    return {
        id: tour.id,
        slug: tour.slug,
        title: tour.title,
        category: normalizeTourCategory(tour.category) ?? null,
        discountLabel: formatTourDiscount(tour.discount_percent),
        discountPercent:
            tour.discount_percent == null || Number.isNaN(Number(tour.discount_percent))
                ? null
                : Number(tour.discount_percent),
        pricePerSeat:
            tour.price_per_seat != null && Number(tour.price_per_seat) > 0
                ? Number(tour.price_per_seat)
                : null,
        image: getTourCoverImage(tour),
        totalBooked,
        remainingSeats,
        departureDate,
        departureSlots,
        daysLeft: getTourDaysUntilStart(departureDate),
        isBookingClosed: hasSlots ? bookableSlots.length === 0 : isTourBookingClosed(departureDate),
    }
}

export function tourDetailPath(slug: string, options?: { demo?: boolean }): string {
    if (options?.demo) {
        return DEMO_TOUR_DETAIL_PATH
    }

    return `/tours/${slug}`
}
