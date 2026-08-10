import { resolveTourAssetUrl } from '@/lib/media/resolve-theme-asset'
import { buildBookingRequestHref } from '@/lib/booking/booking-href'
import { formatTourSlotLabel, getAvailableSeats, isTourBookingClosed } from '@/lib/booking/pricing'
import type {
    InternationalTourRow,
    ListingItem,
    PackageDetail,
    PackageDetailHotel,
    PackageDetailStop,
    TourDetail,
    TourRow,
    TourSlot,
    UmrahPlanRow,
} from './listings.types'

export function formatMoney(amount: number | null | undefined, currency = 'PKR'): string {
    if (amount == null || Number.isNaN(Number(amount)) || Number(amount) <= 0) {
        return 'Price on request'
    }
    const code = (currency || 'PKR').trim().toUpperCase() || 'PKR'
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: code,
            currencyDisplay: 'code',
            maximumFractionDigits: 0,
        }).format(Number(amount))
    } catch {
        return `${code} ${Math.round(Number(amount)).toLocaleString()}`
    }
}

function discountedPrice(
    original: number | null | undefined,
    discountPercent: number | null | undefined
): number | null {
    if (original == null) return null
    if (!discountPercent || discountPercent <= 0) return original
    return original * (1 - discountPercent / 100)
}

export function mapTourToListing(row: TourRow, slots: TourSlot[] = []): ListingItem {
    const discountPercent = Number(row.discount_percent ?? 0)
    const price = discountedPrice(row.price_per_seat, row.discount_percent)
    const currency = 'PKR'
    const days = row.header?.day_count
    const nights = row.header?.night_count
    const durationLabel = days ? `${days} Day${days > 1 ? 's' : ''}` : null
    const meta =
        days || nights
            ? [days ? `${days} days` : null, nights ? `${nights} nights` : null]
                .filter(Boolean)
                .join(' · ')
            : null
    const capacity = row.capacity_total
    const confirmed = row.confirmed_seats ?? 0
    const seatsLeft =
        capacity != null ? Math.max(capacity - confirmed, 0) : null

    const upcomingSlots = slots
        .filter((slot) => slot.isActive && !isTourBookingClosed(slot.startDate))
        .map((slot) => ({
            id: slot.id,
            label: formatTourSlotLabel({ startDate: slot.startDate }),
            seatsLeft: getAvailableSeats(slot.capacityTotal, slot.confirmedSeats),
        }))

    return {
        id: row.id,
        kind: 'tours',
        title: row.header?.title || row.title,
        location: [row.from_location, row.to_location].filter(Boolean).join(' → ') ||
            row.to_location ||
            row.from_location ||
            'Pakistan',
        priceLabel: `from ${formatMoney(price, currency)}`,
        imageUrl: resolveTourAssetUrl(row.header?.hero_image_url) || null,
        href: `/tours/${row.slug || row.id}`,
        summary: row.header?.subtitle || row.title,
        badge: row.overview?.difficulty || row.header?.tag || 'Tour',
        meta,
        durationLabel,
        ratingLabel: '5.0',
        reviewCount: 1,
        featured: true,
        departureDate: row.start_date,
        travelersCapacity: row.capacity_total,
        discountPercent: discountPercent > 0 ? discountPercent : null,
        originalPriceLabel:
            discountPercent > 0 && row.price_per_seat != null
                ? formatMoney(row.price_per_seat, currency)
                : null,
        seatsLeft,
        tripTypeLabel: row.category || 'Public Trip',
        upcomingSlots: upcomingSlots.length > 0 ? upcomingSlots.slice(0, 3) : undefined,
        slotsCount: upcomingSlots.length > 0 ? upcomingSlots.length : null,
    }
}

export function mapUmrahPlanToListing(row: UmrahPlanRow): ListingItem {
    const info = row.basic_information
    const pricing = row.pricing
    const original = pricing?.original_price ?? null
    const discounted =
        pricing?.discount_price && pricing.discount_price > 0
            ? pricing.discount_price
            : null
    const amount = discounted ?? original
    const discountPercent =
        original && discounted && discounted < original
            ? Math.round(((original - discounted) / original) * 100)
            : null
    const days = row.duration_dates?.duration_days
    const durationLabel = days ? `${days} Day${days > 1 ? 's' : ''}` : null
    const currency = pricing?.currency || 'PKR'

    return {
        id: row.id,
        kind: 'packages',
        title: info?.package_title || 'Umrah Package',
        location: 'Makkah & Madinah',
        priceLabel: `from ${formatMoney(amount, currency)}`,
        imageUrl: resolveTourAssetUrl(row.images?.featured_image) || null,
        href: `/packages/umrah/${row.id}`,
        summary: row.descriptions?.short_description || 'Thoughtfully planned Umrah experience.',
        badge: info?.package_category || info?.package_type || 'Package',
        meta: days ? `${days} days` : null,
        durationLabel,
        ratingLabel: '5.0',
        reviewCount: 1,
        featured: Boolean(info?.featured_package),
        departureDate: row.duration_dates?.departure_date ?? null,
        travelersCapacity: row.booking_info?.available_seats ?? null,
        discountPercent,
        originalPriceLabel:
            discountPercent && original != null
                ? formatMoney(original, currency)
                : null,
        seatsLeft: row.booking_info?.available_seats ?? null,
        tripTypeLabel: info?.package_type || 'Public Trip',
    }
}

export function mapInternationalTourToListing(row: InternationalTourRow): ListingItem {
    const info = row.basic_information
    const pricing = row.pricing
    const original = pricing?.original_price ?? null
    const discounted =
        pricing?.discount_price && pricing.discount_price > 0
            ? pricing.discount_price
            : null
    const amount = discounted ?? original
    const discountPercent =
        original && discounted && discounted < original
            ? Math.round(((original - discounted) / original) * 100)
            : null
    const days = row.duration_dates?.duration_days
    const durationLabel = days ? `${days} Day${days > 1 ? 's' : ''}` : null
    const title = info?.package_title || 'International Tour'
    const currency = pricing?.currency || 'PKR'

    return {
        id: row.id,
        kind: 'international',
        title,
        location: guessInternationalLocation(title, row.descriptions?.short_description),
        priceLabel: `from ${formatMoney(amount, currency)}`,
        imageUrl: resolveTourAssetUrl(row.images?.featured_image) || null,
        href: `/packages/international/${row.id}`,
        summary:
            row.descriptions?.short_description ||
            'A premium international getaway designed for smooth travel.',
        badge: info?.package_category || info?.package_type || 'International',
        meta: days ? `${days} days` : null,
        durationLabel,
        ratingLabel: '5.0',
        reviewCount: 1,
        featured: Boolean(info?.featured_package),
        departureDate: row.duration_dates?.departure_date ?? null,
        travelersCapacity: row.booking_info?.available_seats ?? null,
        discountPercent,
        originalPriceLabel:
            discountPercent && original != null
                ? formatMoney(original, currency)
                : null,
        seatsLeft: row.booking_info?.available_seats ?? null,
        tripTypeLabel: info?.package_type || 'Public Trip',
    }
}

export function mapTourToDetail(row: TourRow): TourDetail {
    const price = discountedPrice(row.price_per_seat, row.discount_percent)
    const title = row.header?.title || row.title
    const currency = 'PKR'

    return {
        id: row.id,
        agencyId: row.agency_id,
        slug: row.slug || row.id,
        title,
        tag: row.header?.tag || null,
        subtitle: row.header?.subtitle || null,
        heroImageUrl: resolveTourAssetUrl(row.header?.hero_image_url) || null,
        overviewImageUrl: resolveTourAssetUrl(row.overview?.image_url) || null,
        overviewTitle: row.overview?.title || null,
        overviewBody: row.overview?.body || null,
        difficulty: row.overview?.difficulty || null,
        elevationM: row.overview?.elevation_m ?? null,
        dayCount: row.header?.day_count ?? null,
        nightCount: row.header?.night_count ?? null,
        location:
            [row.from_location, row.to_location].filter(Boolean).join(' → ') ||
            row.to_location ||
            row.from_location ||
            'Pakistan',
        fromLocation: row.from_location,
        toLocation: row.to_location,
        priceLabel: formatMoney(price, currency),
        priceAmount: price,
        pricePerSeat: row.price_per_seat ?? 0,
        currency,
        discountPercent: Number(row.discount_percent ?? 0),
        kidsDiscountPercent: Number(row.kids_discount ?? 0),
        advanceAmountPerSeat:
            row.advance_amount_per_seat != null && Number(row.advance_amount_per_seat) > 0
                ? Number(row.advance_amount_per_seat)
                : null,
        startDate: row.start_date,
        endDate: row.end_date,
        capacityTotal: row.capacity_total,
        confirmedSeats: row.confirmed_seats ?? null,
        slots: [],
        highlights: row.highlights ?? [],
        routeTitle: row.route?.section_title || null,
        routeSegments: row.route?.segments ?? [],
        places: (row.places_visited ?? []).map((place) => ({
            ...place,
            imageUrl: resolveTourAssetUrl(place.image_url) || null,
        })),
        journey: (row.journey ?? []).map((day) => ({
            ...day,
            imageUrl: resolveTourAssetUrl(day.image_url) || null,
        })),
        stays: (row.stay_and_dine ?? []).map((stay) => ({
            ...stay,
            imageUrl: resolveTourAssetUrl(stay.image_url) || null,
        })),
        perks: row.expedition_perks ?? [],
        gallery: (row.visual_fragments ?? [])
            .map((src) => resolveTourAssetUrl(src))
            .filter(Boolean),
    }
}

function guessInternationalLocation(title: string, description?: string | null): string {
    const haystack = `${title} ${description ?? ''}`.toLowerCase()
    const places = [
        'dubai',
        'turkey',
        'istanbul',
        'thailand',
        'malaysia',
        'singapore',
        'maldives',
        'azerbaijan',
        'baku',
        'vietnam',
        'europe',
        'uk',
        'usa',
        'switzerland',
        'georgia',
        'egypt',
        'morocco',
    ]
    for (const place of places) {
        if (haystack.includes(place)) {
            return place.charAt(0).toUpperCase() + place.slice(1)
        }
    }
    return 'International'
}

function packagePriceFields(pricing: UmrahPlanRow['pricing'] | InternationalTourRow['pricing']) {
    const original = pricing?.original_price ?? null
    const discounted =
        pricing?.discount_price && pricing.discount_price > 0
            ? pricing.discount_price
            : null
    const amount = discounted ?? original
    const currency = pricing?.currency || 'PKR'
    const discountPercent =
        original && discounted && discounted < original
            ? Math.round(((original - discounted) / original) * 100)
            : null

    return {
        priceLabel: `from ${formatMoney(amount, currency)}`,
        originalPriceLabel:
            discountPercent && original != null ? formatMoney(original, currency) : null,
        discountPercent,
    }
}

function mapPackageHotel(input: {
    label: string
    hotel_name?: string
    hotel_rating?: string
    distance_meters?: number
    number_of_nights?: number
    room_type?: string
    image?: string
}): PackageDetailHotel | null {
    const name = input.hotel_name?.trim()
    if (!name) return null
    return {
        label: input.label,
        name,
        rating: input.hotel_rating?.trim() || null,
        nights: input.number_of_nights ?? null,
        roomType: input.room_type?.trim() || null,
        distanceMeters: input.distance_meters ?? null,
        imageUrl: resolveTourAssetUrl(input.image) || null,
    }
}

function mapPackageStops(
    stops?: Array<{ title?: string; description?: string }> | null
): PackageDetailStop[] {
    if (!Array.isArray(stops)) return []
    return stops
        .map((stop) => ({
            title: stop.title?.trim() || '',
            description: stop.description?.trim() || null,
        }))
        .filter((stop) => stop.title.length > 0)
}

export function mapUmrahPlanToDetail(row: UmrahPlanRow): PackageDetail {
    const info = row.basic_information
    const title = info?.package_title || 'Umrah Package'
    const prices = packagePriceFields(row.pricing)
    const gallery = (row.images?.gallery_images ?? [])
        .map((src) => resolveTourAssetUrl(src))
        .filter(Boolean)

    const hotelsFromZiyarat = (row.ziyarat?.hotels ?? [])
        .map((hotel) =>
            mapPackageHotel({
                label: hotel.label || 'Hotel',
                hotel_name: hotel.hotel_name,
                hotel_rating: hotel.hotel_rating,
                distance_meters: hotel.distance_meters,
                number_of_nights: hotel.number_of_nights,
                room_type: hotel.room_type,
                image: hotel.image,
            })
        )
        .filter((hotel): hotel is PackageDetailHotel => Boolean(hotel))

    const legacyHotels = [
        mapPackageHotel({
            label: 'Makkah',
            hotel_name: row.makkah_hotel?.hotel_name,
            hotel_rating: row.makkah_hotel?.hotel_rating,
            distance_meters: row.makkah_hotel?.distance_from_haram_meters,
            number_of_nights: row.makkah_hotel?.number_of_nights,
            room_type: row.makkah_hotel?.room_type,
            image: row.makkah_hotel?.image,
        }),
        mapPackageHotel({
            label: 'Madinah',
            hotel_name: row.madinah_hotel?.hotel_name,
            hotel_rating: row.madinah_hotel?.hotel_rating,
            distance_meters: row.madinah_hotel?.distance_from_masjid_e_nabawi_meters,
            number_of_nights: row.madinah_hotel?.number_of_nights,
            room_type: row.madinah_hotel?.room_type,
            image: row.madinah_hotel?.image,
        }),
    ].filter((hotel): hotel is PackageDetailHotel => Boolean(hotel))

    const stops = mapPackageStops(row.ziyarat?.stops)
    if (stops.length === 0) {
        if (row.ziyarat?.makkah_ziyarat_details?.trim()) {
            stops.push({
                title: 'Makkah ziyarat',
                description: row.ziyarat.makkah_ziyarat_details.trim(),
            })
        }
        if (row.ziyarat?.madinah_ziyarat_details?.trim()) {
            stops.push({
                title: 'Madinah ziyarat',
                description: row.ziyarat.madinah_ziyarat_details.trim(),
            })
        }
    }

    return {
        id: row.id,
        agencyId: row.agency_id,
        kind: 'umrah',
        title,
        badge: info?.package_category || info?.package_type || 'Package',
        location: 'Makkah & Madinah',
        ...prices,
        heroImageUrl: resolveTourAssetUrl(row.images?.featured_image) || null,
        gallery,
        shortDescription: row.descriptions?.short_description || null,
        detailedDescription: row.descriptions?.detailed_description || null,
        durationDays: row.duration_dates?.duration_days ?? null,
        departureDate: row.duration_dates?.departure_date ?? null,
        returnDate: row.duration_dates?.return_date ?? null,
        seatsAvailable: row.booking_info?.available_seats ?? null,
        seatsTotal: row.booking_info?.total_seats ?? null,
        bookingDeadline: row.booking_info?.booking_deadline ?? null,
        includes: row.package_includes?.items ?? [],
        excludes: row.package_excludes?.items ?? [],
        hotels: hotelsFromZiyarat.length > 0 ? hotelsFromZiyarat : legacyHotels,
        stops,
        airline: row.flight_information?.airline_name || null,
        flightType: row.flight_information?.flight_type || null,
        baggage: row.flight_information?.baggage_allowance || null,
        notes: row.terms_notes?.important_notes || null,
        terms: row.terms_notes?.terms_and_conditions || null,
        requestHref: buildBookingRequestHref({
            kind: 'umrah',
            id: row.id,
            title,
        }),
    }
}

export function mapInternationalTourToDetail(row: InternationalTourRow): PackageDetail {
    const info = row.basic_information
    const title = info?.package_title || 'International Tour'
    const prices = packagePriceFields(row.pricing)
    const gallery = (row.images?.gallery_images ?? [])
        .map((src) => resolveTourAssetUrl(src))
        .filter(Boolean)

    const hotelsFromItems = (row.hotels?.items ?? [])
        .map((hotel) =>
            mapPackageHotel({
                label: hotel.label || 'Hotel',
                hotel_name: hotel.hotel_name,
                hotel_rating: hotel.hotel_rating,
                distance_meters: hotel.distance_meters,
                number_of_nights: hotel.number_of_nights,
                room_type: hotel.room_type,
                image: hotel.image,
            })
        )
        .filter((hotel): hotel is PackageDetailHotel => Boolean(hotel))

    const legacyHotels = [
        mapPackageHotel({
            label: 'Primary hotel',
            hotel_name: row.makkah_hotel?.hotel_name || row.hotels?.makkah_hotel?.hotel_name,
            hotel_rating:
                row.makkah_hotel?.hotel_rating || row.hotels?.makkah_hotel?.hotel_rating,
            distance_meters:
                row.makkah_hotel?.distance_from_haram_meters ||
                row.hotels?.makkah_hotel?.distance_from_haram_meters,
            number_of_nights:
                row.makkah_hotel?.number_of_nights || row.hotels?.makkah_hotel?.number_of_nights,
            room_type: row.makkah_hotel?.room_type || row.hotels?.makkah_hotel?.room_type,
            image: row.makkah_hotel?.image || row.hotels?.makkah_hotel?.image,
        }),
        mapPackageHotel({
            label: 'Secondary hotel',
            hotel_name: row.madinah_hotel?.hotel_name || row.hotels?.madinah_hotel?.hotel_name,
            hotel_rating:
                row.madinah_hotel?.hotel_rating || row.hotels?.madinah_hotel?.hotel_rating,
            distance_meters:
                row.madinah_hotel?.distance_from_masjid_e_nabawi_meters ||
                row.hotels?.madinah_hotel?.distance_from_masjid_e_nabawi_meters,
            number_of_nights:
                row.madinah_hotel?.number_of_nights ||
                row.hotels?.madinah_hotel?.number_of_nights,
            room_type: row.madinah_hotel?.room_type || row.hotels?.madinah_hotel?.room_type,
            image: row.madinah_hotel?.image || row.hotels?.madinah_hotel?.image,
        }),
    ].filter((hotel): hotel is PackageDetailHotel => Boolean(hotel))

    const stops = mapPackageStops(row.itinerary?.stops)
    if (stops.length === 0) {
        if (row.itinerary?.makkah_ziyarat_details?.trim()) {
            stops.push({
                title: 'Itinerary highlight',
                description: row.itinerary.makkah_ziyarat_details.trim(),
            })
        }
        if (row.itinerary?.madinah_ziyarat_details?.trim()) {
            stops.push({
                title: 'Additional notes',
                description: row.itinerary.madinah_ziyarat_details.trim(),
            })
        }
    }

    return {
        id: row.id,
        agencyId: row.agency_id,
        kind: 'international',
        title,
        badge: info?.package_category || info?.package_type || 'International',
        location: guessInternationalLocation(title, row.descriptions?.short_description),
        ...prices,
        heroImageUrl: resolveTourAssetUrl(row.images?.featured_image) || null,
        gallery,
        shortDescription: row.descriptions?.short_description || null,
        detailedDescription: row.descriptions?.detailed_description || null,
        durationDays: row.duration_dates?.duration_days ?? null,
        departureDate: row.duration_dates?.departure_date ?? null,
        returnDate: row.duration_dates?.return_date ?? null,
        seatsAvailable: row.booking_info?.available_seats ?? null,
        seatsTotal: row.booking_info?.total_seats ?? null,
        bookingDeadline: row.booking_info?.booking_deadline ?? null,
        includes: row.package_includes?.items ?? [],
        excludes: row.package_excludes?.items ?? [],
        hotels: hotelsFromItems.length > 0 ? hotelsFromItems : legacyHotels,
        stops,
        airline: row.flight_information?.airline_name || null,
        flightType: row.flight_information?.flight_type || null,
        baggage: row.flight_information?.baggage_allowance || null,
        notes: row.terms_notes?.important_notes || null,
        terms: row.terms_notes?.terms_and_conditions || null,
        requestHref: buildBookingRequestHref({
            kind: 'international',
            id: row.id,
            title,
        }),
    }
}
