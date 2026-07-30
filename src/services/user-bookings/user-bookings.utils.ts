import { resolveTourAssetUrl } from '@/lib/media/resolve-theme-asset'
import type {
    UserBookingDisplay,
    UserBookingPaymentRow,
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

function parseTour(row: UserBookingRow): UserBookingTourRow | null {
    if (!row.tours) return null
    return Array.isArray(row.tours) ? (row.tours[0] ?? null) : row.tours
}

function parsePayment(row: UserBookingRow): UserBookingPaymentRow | null {
    if (!row.payment) return null
    return Array.isArray(row.payment) ? (row.payment[0] ?? null) : row.payment
}

function coverImage(tour: UserBookingTourRow | null): string {
    if (!tour) return ''
    return (
        resolveTourAssetUrl(tour.header?.hero_image_url) ||
        resolveTourAssetUrl(tour.overview?.image_url) ||
        resolveTourAssetUrl(tour.visual_fragments?.[0]) ||
        ''
    )
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
    bookingStatus: string | null,
    paymentStatus: string | null,
    hasPaymentScreenshot: boolean
): { label: string; tone: UserBookingStatusTone; warning: string } {
    const booking = (bookingStatus ?? 'pending').trim().toLowerCase()
    const payment = (paymentStatus ?? '').trim().toUpperCase()

    if (booking === 'cancelled' || booking === 'canceled') {
        return { label: 'Cancelled', tone: 'cancelled', warning: '' }
    }
    if (booking === 'completed') {
        return { label: 'Completed', tone: 'completed', warning: '' }
    }
    if (booking === 'confirmed') {
        return { label: 'Confirmed', tone: 'confirmed', warning: '' }
    }
    if (payment === 'REJECTED') {
        return {
            label: 'Payment rejected',
            tone: 'action',
            warning: 'Your payment was not accepted. Contact the agency or rebook.',
        }
    }
    if (payment === 'PENDING_REVIEW' || hasPaymentScreenshot) {
        return {
            label: 'Under review',
            tone: 'pending',
            warning: 'Payment is being verified. We’ll update you soon.',
        }
    }
    if (!hasPaymentScreenshot) {
        return {
            label: 'Action required',
            tone: 'action',
            warning: 'Complete payment to confirm this booking.',
        }
    }
    return { label: 'Pending', tone: 'pending', warning: '' }
}

export function mapBookingRowToDisplay(row: UserBookingRow): UserBookingDisplay {
    const tour = parseTour(row)
    const payment = parsePayment(row)
    const seats =
        Number(row.male_seat ?? 0) +
        Number(row.female_seat ?? 0) +
        Number(row.kids_seats ?? 0)
    const status = mapStatus(
        row.status,
        payment?.status ?? null,
        Boolean(row.booking_payment_screenshot)
    )

    const start = tour?.start_date ? new Date(tour.start_date) : null
    const end = tour?.end_date ? new Date(tour.end_date) : null
    const schedule =
        start && !Number.isNaN(start.getTime())
            ? end && !Number.isNaN(end.getTime())
                ? `${start.toLocaleDateString('en-US', DATE_FORMAT)} — ${end.toLocaleDateString('en-US', DATE_FORMAT)}`
                : start.toLocaleDateString('en-US', DATE_FORMAT)
            : 'Dates TBA'

    return {
        id: row.id,
        referenceId: `BK-${row.id.replace(/-/g, '').slice(0, 6).toUpperCase()}`,
        status: status.label,
        statusTone: status.tone,
        title: tour?.header?.title || tour?.title || 'Tour booking',
        image: coverImage(tour),
        schedule,
        location: tour?.to_location || tour?.from_location || 'Pakistan',
        members: seats === 1 ? '1 traveler' : `${seats || 1} travelers`,
        warning: status.warning,
        slug: tour?.slug ?? null,
        isPast: isPastTour(tour?.end_date ?? null, tour?.start_date ?? null),
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
        const tour = parseTour(row)

        if (
            display.isPast ||
            normalized === 'completed' ||
            normalized === 'cancelled' ||
            normalized === 'canceled'
        ) {
            const cancelled =
                normalized === 'cancelled' || normalized === 'canceled'
            past.push({
                id: row.id,
                status: cancelled ? 'Cancelled' : 'Completed',
                statusTone: cancelled ? 'cancelled' : 'completed',
                date: display.schedule,
                title: display.title,
                note: cancelled
                    ? 'This booking was cancelled.'
                    : 'Thanks for traveling with us.',
                slug: tour?.slug ?? null,
            })
            continue
        }

        upcoming.push(display)
    }

    return { upcoming, past }
}
