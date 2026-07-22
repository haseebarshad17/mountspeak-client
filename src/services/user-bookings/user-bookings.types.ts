import type { ListingKind } from '@/lib/homepage/specialization'
import type { BookingItineraryContent } from '@/lib/bookings/booking-itinerary-content'
import type { InternationalTourRow } from '@/services/international-tour/international-tour.types'
import type {
    TourHeaderPayload,
    TourOverviewPayload,
    TourPerkPayload,
    TourRoutePayload,
    TourStayPayload,
} from '@/services/tours/tours.payload.types'
import type { UmrahPlanRow } from '@/services/umrah-plan/umrah-plan.types'

export type UserBookingTourRow = {
    id: string
    slug: string | null
    title: string
    from_location: string | null
    to_location: string | null
    start_date: string | null
    end_date: string | null
    header: TourHeaderPayload | null
    overview: TourOverviewPayload | null
    visual_fragments: string[] | null
    route: TourRoutePayload | null
    stay_and_dine: TourStayPayload[] | null
    expedition_perks: TourPerkPayload[] | null
}

type PackageHotelEmbed = {
    hotel_name?: string | null
    hotel_rating?: string | null
    number_of_nights?: number | null
    room_type?: string | null
    distance_from_haram_meters?: number | null
    distance_from_masjid_e_nabawi_meters?: number | null
} | null

export type UserBookingUmrahPlanRow = UmrahPlanRow & {
    makkah_hotel?: PackageHotelEmbed
    madinah_hotel?: PackageHotelEmbed
    ziyarat?: {
        makkah_ziyarat_details?: string | null
        madinah_ziyarat_details?: string | null
    } | null
    package_includes?: {
        items?: string[] | null
    } | null
}

export type UserBookingInternationalTourRow = InternationalTourRow & {
    hotels?: {
        makkah_hotel?: PackageHotelEmbed
        madinah_hotel?: PackageHotelEmbed
    } | null
    itinerary?: {
        makkah_ziyarat_details?: string | null
        madinah_ziyarat_details?: string | null
    } | null
    package_includes?: {
        items?: string[] | null
    } | null
}

export type UserBookingPaymentRow = {
    status: string | null
}

export type UserBookingRow = {
    id: string
    status: string | null
    created_at: string
    male_seat: number | null
    female_seat: number | null
    kids_seats: number | null
    booking_payment_screenshot: string | null
    payment_id: string | null
    listing_kind: ListingKind | null
    umrah_plan_id: string | null
    international_tour_id: string | null
    payment: UserBookingPaymentRow | UserBookingPaymentRow[] | null
    tours: UserBookingTourRow | UserBookingTourRow[] | null
    umrah_plan: UserBookingUmrahPlanRow | UserBookingUmrahPlanRow[] | null
    international_tour: UserBookingInternationalTourRow | UserBookingInternationalTourRow[] | null
}

export type UserBookingStatusTone = 'confirmed' | 'action' | 'completed' | 'cancelled' | 'pending'

export type UserBookingDisplay = {
    id: string
    referenceId: string
    status: string
    statusTone: UserBookingStatusTone
    listingKind: ListingKind
    listingKindLabel: string
    title: string
    image: string
    schedule: string
    location: string
    region: string
    dateLabel: string
    members: string
    memberCount: number
    warning: string
    slug: string | null
    packageId: string | null
    primaryAction: string
    secondaryAction: string
    isPast: boolean
    itineraryContent: BookingItineraryContent
}

export type UserPastBookingDisplay = {
    status: string
    statusTone: 'completed' | 'cancelled'
    date: string
    title: string
    listingKindLabel: string
    note: string
    action: string
}
