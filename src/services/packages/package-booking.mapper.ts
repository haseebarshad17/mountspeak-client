import type { BookingTourOption } from '@/components/pages/booking/booking.types'
import { isPackageBookingClosed } from '@/lib/booking/tour-booking-rules'
import type { ListingKind } from '@/lib/homepage/specialization'
import type { InternationalTourRow } from '@/services/international-tour/international-tour.types'
import type { UmrahPlanRow } from '@/services/umrah-plan/umrah-plan.types'

type PackagePricing = {
    original_price?: number | null
    discount_price?: number | null
} | null

function resolvePackageBookingPrice(pricing: PackagePricing): {
    pricePerSeat: number
    discountPercent: number
} {
    const original = Number(pricing?.original_price ?? 0)
    const discounted = Number(pricing?.discount_price ?? 0)

    if (original > 0 && discounted > 0 && discounted < original) {
        return {
            pricePerSeat: original,
            discountPercent: Math.round(((original - discounted) / original) * 100),
        }
    }

    return {
        pricePerSeat: Math.max(original, 0),
        discountPercent: 0,
    }
}

function mapPackageRowToBookingOption(params: {
    id: string
    agencyId: string | null
    title: string
    pricing: PackagePricing
    departureDate: string | null
    bookingDeadline: string | null
    totalSeats: number | null
    availableSeats: number | null
    listingKind: Exclude<ListingKind, 'tour'>
}): BookingTourOption | null {
    const { pricePerSeat, discountPercent } = resolvePackageBookingPrice(params.pricing)
    if (pricePerSeat <= 0) return null

    const totalSeats = Math.max(0, params.totalSeats ?? 0)
    const availableSeats =
        params.availableSeats != null ? Math.max(0, params.availableSeats) : null
    const confirmedSeats =
        totalSeats > 0 && availableSeats != null
            ? Math.max(0, totalSeats - availableSeats)
            : 0

    return {
        id: params.id,
        slug: params.id,
        title: params.title,
        agencyId: params.agencyId ?? '',
        pricePerSeat,
        advanceAmountPerSeat: null,
        discountPercent,
        kidsDiscountPercent: 0,
        startDate: params.departureDate,
        capacityTotal: totalSeats > 0 ? totalSeats : null,
        confirmedSeats,
        availableSeats,
        isBookingClosed: isPackageBookingClosed({
            departureDate: params.departureDate,
            bookingDeadline: params.bookingDeadline,
        }),
        slots: [],
        pickupPoints: [],
        listingKind: params.listingKind,
    }
}

export function mapUmrahPlanToBookingOption(plan: UmrahPlanRow): BookingTourOption | null {
    return mapPackageRowToBookingOption({
        id: plan.id,
        agencyId: plan.agency_id,
        title: plan.basic_information?.package_title?.trim() || 'Umrah package',
        pricing: plan.pricing,
        departureDate: plan.duration_dates?.departure_date?.trim() || null,
        bookingDeadline: plan.booking_info?.booking_deadline?.trim() || null,
        totalSeats: plan.booking_info?.total_seats ?? null,
        availableSeats: plan.booking_info?.available_seats ?? null,
        listingKind: 'umrah',
    })
}

export function mapInternationalTourToBookingOption(
    plan: InternationalTourRow,
): BookingTourOption | null {
    return mapPackageRowToBookingOption({
        id: plan.id,
        agencyId: plan.agency_id,
        title: plan.basic_information?.package_title?.trim() || 'International tour',
        pricing: plan.pricing,
        departureDate: plan.duration_dates?.departure_date?.trim() || null,
        bookingDeadline: plan.booking_info?.booking_deadline?.trim() || null,
        totalSeats: plan.booking_info?.total_seats ?? null,
        availableSeats: plan.booking_info?.available_seats ?? null,
        listingKind: 'international',
    })
}

export function buildPackageBookingHref(
    kind: Exclude<ListingKind, 'tour'>,
    packageId: string,
): string {
    const id = packageId.trim()
    if (!id) return '/booking'

    const params = new URLSearchParams({
        kind,
        id,
    })

    return `/booking?${params.toString()}`
}
