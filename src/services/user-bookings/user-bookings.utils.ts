import type { ListingKind } from '@/lib/homepage/specialization'
import {
    EMPTY_BOOKING_ITINERARY_CONTENT,
    extractDomesticTourItineraryContent,
    extractPackageItineraryContent,
    type BookingItineraryContent,
} from '@/lib/bookings/booking-itinerary-content'
import { resolvePackageMediaUrlOrPlaceholder } from '@/lib/supabase/package-media'
import type { InternationalTourRow } from '@/services/international-tour/international-tour.types'
import { getTourCoverImage } from '@/services/tours/tours.utils'
import type { UmrahPlanRow } from '@/services/umrah-plan/umrah-plan.types'

import type {
    UserBookingDisplay,
    UserBookingInternationalTourRow,
    UserBookingPaymentRow,
    UserBookingRow,
    UserBookingStatusTone,
    UserBookingTourRow,
    UserBookingUmrahPlanRow,
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

const LISTING_KIND_LABELS: Record<ListingKind, string> = {
    tour: 'Domestic Tour',
    umrah: 'Hajj & Umrah',
    international: 'International Tour',
}

function unwrapRelation<T>(value: T | T[] | null | undefined): T | null {
    if (!value) return null
    return Array.isArray(value) ? (value[0] ?? null) : value
}

function parseTour(row: UserBookingRow): UserBookingTourRow | null {
    return unwrapRelation(row.tours)
}

function parseUmrahPlan(row: UserBookingRow): UserBookingUmrahPlanRow | null {
    return unwrapRelation(row.umrah_plan)
}

function parseInternationalTour(row: UserBookingRow): UserBookingInternationalTourRow | null {
    return unwrapRelation(row.international_tour)
}

function resolveListingKind(row: UserBookingRow): ListingKind {
    const kind = row.listing_kind?.trim().toLowerCase()
    if (kind === 'umrah' || kind === 'international') return kind
    if (row.umrah_plan_id) return 'umrah'
    if (row.international_tour_id) return 'international'
    return 'tour'
}

function listingKindLabel(kind: ListingKind): string {
    return LISTING_KIND_LABELS[kind]
}

function toIsoDate(date: Date): string {
    return date.toISOString().slice(0, 10)
}

function formatPackageSchedule(plan: UmrahPlanRow | InternationalTourRow): string {
    const departure = plan.duration_dates?.departure_date?.trim()
    if (!departure) return 'Dates to be announced'

    const durationDays = Number(plan.duration_dates?.duration_days ?? 0)
    if (Number.isFinite(durationDays) && durationDays > 1) {
        const start = new Date(departure)
        if (!Number.isNaN(start.getTime())) {
            const end = new Date(start)
            end.setDate(end.getDate() + durationDays - 1)
            return formatBookingSchedule(departure, toIsoDate(end))
        }
    }

    return formatBookingSchedule(departure, null)
}

function resolvePackageLocation(
    kind: ListingKind,
    plan: UmrahPlanRow | InternationalTourRow,
): string {
    const category = plan.basic_information?.package_category?.trim()
    if (category) return category
    if (kind === 'umrah') return 'Saudi Arabia'
    if (kind === 'international') return 'International'
    return 'Pakistan'
}

function resolvePackageTitle(plan: UmrahPlanRow | InternationalTourRow, fallback: string): string {
    return plan.basic_information?.package_title?.trim() || fallback
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

function isPastBooking(endDate: string | null, startDate: string | null): boolean {
    const reference = endDate ?? startDate
    if (!reference) return false

    const date = new Date(reference)
    if (Number.isNaN(date.getTime())) return false

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
}

function parsePayment(row: UserBookingRow): UserBookingPaymentRow | null {
    return unwrapRelation(row.payment)
}

function mapStatus(
    bookingStatus: string | null,
    paymentStatus: string | null,
    hasPaymentScreenshot: boolean,
): { label: string; tone: UserBookingStatusTone; warning: string } {
    const normalizedBooking = (bookingStatus ?? 'pending').trim().toLowerCase()
    const normalizedPayment = (paymentStatus ?? '').trim().toUpperCase()

    if (normalizedBooking === 'cancelled' || normalizedBooking === 'canceled') {
        if (normalizedPayment === 'REFUNDED') {
            return { label: 'Refunded', tone: 'cancelled', warning: '' }
        }
        return { label: 'Cancelled', tone: 'cancelled', warning: '' }
    }

    if (normalizedBooking === 'completed') {
        return { label: 'Completed', tone: 'completed', warning: '' }
    }

    if (normalizedBooking === 'confirmed') {
        return { label: 'Confirmed', tone: 'confirmed', warning: '' }
    }

    if (normalizedPayment === 'REJECTED') {
        return {
            label: 'Payment Rejected',
            tone: 'action',
            warning: 'Your payment was not accepted. Please contact the agency or submit a new booking.',
        }
    }

    if (normalizedPayment === 'PENDING_REVIEW' || hasPaymentScreenshot) {
        return {
            label: 'Payment Under Review',
            tone: 'pending',
            warning: 'Our team is verifying your payment. We will contact you shortly.',
        }
    }

    if (!hasPaymentScreenshot) {
        return {
            label: 'Action Required',
            tone: 'action',
            warning: 'Please upload your payment screenshot to complete your booking.',
        }
    }

    return { label: 'Pending', tone: 'pending', warning: '' }
}

type ResolvedBookingContent = {
    listingKind: ListingKind
    title: string
    image: string
    schedule: string
    location: string
    region: string
    dateLabel: string
    slug: string | null
    packageId: string | null
    isPast: boolean
    itineraryContent: BookingItineraryContent
}

function resolveItineraryContent(row: UserBookingRow, listingKind: ListingKind): BookingItineraryContent {
    if (listingKind === 'umrah') {
        const plan = parseUmrahPlan(row)
        if (plan) return extractPackageItineraryContent(plan, 'umrah')
    }

    if (listingKind === 'international') {
        const plan = parseInternationalTour(row)
        if (plan) return extractPackageItineraryContent(plan, 'international')
    }

    const tour = parseTour(row)
    if (tour) {
        return extractDomesticTourItineraryContent({
            route: tour.route,
            stay_and_dine: tour.stay_and_dine,
            expedition_perks: tour.expedition_perks,
        })
    }

    return EMPTY_BOOKING_ITINERARY_CONTENT
}

function resolveBookingContent(row: UserBookingRow): ResolvedBookingContent {
    const listingKind = resolveListingKind(row)
    const tour = parseTour(row)
    const itineraryContent = resolveItineraryContent(row, listingKind)

    if (listingKind === 'umrah') {
        const plan = parseUmrahPlan(row)
        if (plan) {
            const departure = plan.duration_dates?.departure_date?.trim() || null
            const location = resolvePackageLocation('umrah', plan)
            return {
                listingKind,
                title: resolvePackageTitle(plan, 'Umrah package'),
                image: resolvePackageMediaUrlOrPlaceholder(plan.images?.featured_image, 'umrah'),
                schedule: formatPackageSchedule(plan),
                location,
                region: location,
                dateLabel: formatBookingDateLabel(departure),
                slug: plan.id,
                packageId: plan.id,
                isPast: isPastBooking(null, departure),
                itineraryContent,
            }
        }
    }

    if (listingKind === 'international') {
        const plan = parseInternationalTour(row)
        if (plan) {
            const departure = plan.duration_dates?.departure_date?.trim() || null
            const location = resolvePackageLocation('international', plan)
            return {
                listingKind,
                title: resolvePackageTitle(plan, 'International tour'),
                image: resolvePackageMediaUrlOrPlaceholder(plan.images?.featured_image, 'international'),
                schedule: formatPackageSchedule(plan),
                location,
                region: location,
                dateLabel: formatBookingDateLabel(departure),
                slug: plan.id,
                packageId: plan.id,
                isPast: isPastBooking(null, departure),
                itineraryContent,
            }
        }
    }

    const location = tour?.to_location ?? tour?.from_location ?? 'Pakistan'
    const region = tour?.from_location ?? tour?.to_location ?? location

    return {
        listingKind: 'tour',
        title: tour?.title ?? 'Expedition booking',
        image: getTourCoverImage(
            tour ?? { header: null, overview: null, visual_fragments: null },
        ),
        schedule: formatBookingSchedule(tour?.start_date ?? null, tour?.end_date ?? null),
        location,
        region,
        dateLabel: formatBookingDateLabel(tour?.start_date ?? null),
        slug: tour?.slug ?? null,
        packageId: null,
        isPast: isPastBooking(tour?.end_date ?? null, tour?.start_date ?? null),
        itineraryContent,
    }
}

export function mapBookingRowToDisplay(row: UserBookingRow): UserBookingDisplay {
    const payment = parsePayment(row)
    const members = formatMemberCount(row.male_seat, row.female_seat, row.kids_seats)
    const status = mapStatus(
        row.status,
        payment?.status ?? null,
        Boolean(row.booking_payment_screenshot),
    )
    const content = resolveBookingContent(row)

    return {
        id: row.id,
        referenceId: toBookingReference(row.id),
        status: status.label,
        statusTone: status.tone,
        listingKind: content.listingKind,
        listingKindLabel: listingKindLabel(content.listingKind),
        title: content.title,
        image: content.image,
        schedule: content.schedule,
        location: content.location,
        region: content.region,
        dateLabel: content.dateLabel,
        members: members.label,
        memberCount: members.count,
        warning: status.warning,
        slug: content.slug,
        packageId: content.packageId,
        primaryAction: 'Download Itinerary',
        secondaryAction: '',
        isPast: content.isPast,
        itineraryContent: content.itineraryContent,
    }
}

function resolveScheduleStartDate(row: UserBookingRow, listingKind: ListingKind): string | null {
    if (listingKind === 'tour') {
        return parseTour(row)?.start_date ?? null
    }

    if (listingKind === 'umrah') {
        return parseUmrahPlan(row)?.duration_dates?.departure_date?.trim() || null
    }

    return parseInternationalTour(row)?.duration_dates?.departure_date?.trim() || null
}

export function mapBookingRowToPastDisplay(row: UserBookingRow): UserPastBookingDisplay {
    const content = resolveBookingContent(row)
    const normalized = (row.status ?? '').trim().toLowerCase()
    const isCancelled = normalized === 'cancelled' || normalized === 'canceled'

    return {
        status: isCancelled ? 'Cancelled' : 'Completed',
        statusTone: isCancelled ? 'cancelled' : 'completed',
        date: formatPastBookingDate(
            resolveScheduleStartDate(row, content.listingKind),
            row.created_at,
        ),
        title: content.title,
        listingKindLabel: listingKindLabel(content.listingKind),
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
