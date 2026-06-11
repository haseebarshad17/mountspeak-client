import { getTourCoverImage } from '@/services/tours/tours.utils'

import type {
    UserBookingDisplay,
    UserBookingRow,
    UserBookingStatusTone,
    UserBookingTourRow,
    UserPastBookingDisplay,
} from './user-bookings.types'

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
}

const MONTH_YEAR_FORMAT: Intl.DateTimeFormatOptions = {
    month: 'short',
    year: 'numeric',
}

function parseTour(row: UserBookingRow): UserBookingTourRow | null {
    if (!row.tours) return null
    return Array.isArray(row.tours) ? (row.tours[0] ?? null) : row.tours
}

export function toBookingReference(id: string): string {
    const compact = id.replace(/-/g, '').slice(0, 6).toUpperCase()
    return `APT-${compact}`
}

export function formatMemberCount(
    maleSeats: number | null,
    femaleSeats: number | null,
    kidsSeats: number | null,
): { label: string; count: number } {
    const count = Number(maleSeats ?? 0) + Number(femaleSeats ?? 0) + Number(kidsSeats ?? 0)
    const label = count === 1 ? '1 Member' : `${count} Members`
    return { label, count }
}

export function formatBookingSchedule(
    startDate: string | null,
    endDate: string | null,
): string {
    if (!startDate) return 'Dates to be announced'

    const start = new Date(startDate)
    const startLabel = start.toLocaleDateString('en-US', DATE_FORMAT)

    if (!endDate) return startLabel

    const end = new Date(endDate)
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return startLabel
    }

    const endLabel = end.toLocaleDateString('en-US', DATE_FORMAT)
    return `${startLabel} — ${endLabel}`
}

export function formatBookingDateLabel(startDate: string | null): string {
    if (!startDate) return 'Date TBA'
    const date = new Date(startDate)
    if (Number.isNaN(date.getTime())) return 'Date TBA'
    return date.toLocaleDateString('en-US', DATE_FORMAT)
}

export function formatPastBookingDate(
    startDate: string | null,
    createdAt: string,
): string {
    const source = startDate ?? createdAt
    const date = new Date(source)
    if (Number.isNaN(date.getTime())) return '—'
    return date.toLocaleDateString('en-US', MONTH_YEAR_FORMAT)
}

function isPastTour(endDate: string | null, startDate: string | null): boolean {
    const reference = endDate ?? startDate
    if (!reference) return false

    const date = new Date(reference)
    if (Number.isNaN(date.getTime())) return false

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
}

function mapStatus(
    status: string | null,
    hasPaymentScreenshot: boolean,
): { label: string; tone: UserBookingStatusTone; warning: string } {
    const normalized = (status ?? 'pending').trim().toLowerCase()

    if (normalized === 'cancelled' || normalized === 'canceled') {
        return { label: 'Cancelled', tone: 'cancelled', warning: '' }
    }

    if (normalized === 'completed') {
        return { label: 'Completed', tone: 'completed', warning: '' }
    }

    if (normalized === 'confirmed') {
        return { label: 'Confirmed', tone: 'confirmed', warning: '' }
    }

    if (!hasPaymentScreenshot) {
        return {
            label: 'Action Required',
            tone: 'action',
            warning: 'Please upload a copy of your passport to confirm booking.',
        }
    }

    return { label: 'Pending', tone: 'pending', warning: '' }
}

function mapActions(tone: UserBookingStatusTone): {
    primaryAction: string
    secondaryAction: string
} {
    if (tone === 'action' || tone === 'pending') {
        return {
            primaryAction: 'Complete Booking',
            secondaryAction: 'Request Cancellation',
        }
    }

    return {
        primaryAction: 'View Itinerary',
        secondaryAction: 'Download Permit',
    }
}

export function mapBookingRowToDisplay(row: UserBookingRow): UserBookingDisplay {
    const tour = parseTour(row)
    const members = formatMemberCount(row.male_seat, row.female_seat, row.kids_seats)
    const status = mapStatus(row.status, Boolean(row.booking_payment_screenshot))
    const actions = mapActions(status.tone)
    const location = tour?.to_location ?? tour?.from_location ?? 'Pakistan'
    const region = tour?.from_location ?? tour?.to_location ?? location

    return {
        id: row.id,
        referenceId: toBookingReference(row.id),
        status: status.label,
        statusTone: status.tone,
        title: tour?.title ?? 'Expedition booking',
        image: getTourCoverImage(
            tour ?? { header: null, overview: null, visual_fragments: null },
        ),
        schedule: formatBookingSchedule(tour?.start_date ?? null, tour?.end_date ?? null),
        location,
        region,
        dateLabel: formatBookingDateLabel(tour?.start_date ?? null),
        members: members.label,
        memberCount: members.count,
        warning: status.warning,
        primaryAction: actions.primaryAction,
        secondaryAction: actions.secondaryAction,
        isPast: isPastTour(tour?.end_date ?? null, tour?.start_date ?? null),
    }
}

export function mapBookingRowToPastDisplay(row: UserBookingRow): UserPastBookingDisplay {
    const tour = parseTour(row)
    const normalized = (row.status ?? '').trim().toLowerCase()
    const isCancelled = normalized === 'cancelled' || normalized === 'canceled'

    return {
        status: isCancelled ? 'Cancelled' : 'Completed',
        statusTone: isCancelled ? 'cancelled' : 'completed',
        date: formatPastBookingDate(tour?.start_date ?? null, row.created_at),
        title: tour?.title ?? 'Expedition booking',
        note: isCancelled
            ? 'This booking was cancelled.'
            : 'Thank you for traveling with us.',
        action: isCancelled ? 'Refund Processed' : 'Rebook Tour',
    }
}

export function partitionBookings(rows: UserBookingRow[]): {
    upcoming: UserBookingDisplay[]
    past: UserPastBookingDisplay[]
} {
    const upcoming: UserBookingDisplay[] = []
    const past: UserPastBookingDisplay[] = []

    for (const row of rows) {
        const display = mapBookingRowToDisplay(row)
        const normalized = (row.status ?? '').trim().toLowerCase()

        if (
            display.isPast ||
            normalized === 'completed' ||
            normalized === 'cancelled' ||
            normalized === 'canceled'
        ) {
            past.push(mapBookingRowToPastDisplay(row))
            continue
        }

        upcoming.push(display)
    }

    return { upcoming, past }
}
