import { resolveTourAssetUrl } from '@/lib/media/resolve-theme-asset'
import type {
    InternationalTourRow,
    ListingItem,
    TourDetail,
    TourRow,
    UmrahPlanRow,
} from './listings.types'

export function formatMoney(amount: number | null | undefined, currency = 'USD'): string {
    if (amount == null || Number.isNaN(Number(amount)) || Number(amount) <= 0) {
        return 'Price on request'
    }
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency || 'USD',
            maximumFractionDigits: 0,
        }).format(Number(amount))
    } catch {
        return `${currency} ${Math.round(Number(amount)).toLocaleString()}`
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

export function mapTourToListing(row: TourRow): ListingItem {
    const price = discountedPrice(row.price_per_seat, row.discount_percent)
    const days = row.header?.day_count
    const nights = row.header?.night_count
    const durationLabel = days ? `${days} Day${days > 1 ? 's' : ''}` : null
    const meta =
        days || nights
            ? [days ? `${days} days` : null, nights ? `${nights} nights` : null]
                  .filter(Boolean)
                  .join(' · ')
            : null

    return {
        id: row.id,
        kind: 'tours',
        title: row.header?.title || row.title,
        location: [row.from_location, row.to_location].filter(Boolean).join(' → ') ||
            row.to_location ||
            row.from_location ||
            'Pakistan',
        priceLabel: `from ${formatMoney(price, 'USD')}`,
        imageUrl: resolveTourAssetUrl(row.header?.hero_image_url) || null,
        href: `/tours/${row.slug || row.id}`,
        summary: row.header?.subtitle || row.title,
        badge: row.header?.tag || 'Tour',
        meta,
        durationLabel,
        ratingLabel: '5.0',
        reviewCount: 1,
        featured: true,
        departureDate: row.start_date,
        travelersCapacity: row.capacity_total,
    }
}

export function mapUmrahPlanToListing(row: UmrahPlanRow): ListingItem {
    const info = row.basic_information
    const pricing = row.pricing
    const amount =
        pricing?.discount_price && pricing.discount_price > 0
            ? pricing.discount_price
            : pricing?.original_price
    const days = row.duration_dates?.duration_days
    const durationLabel = days ? `${days} Day${days > 1 ? 's' : ''}` : null

    return {
        id: row.id,
        kind: 'packages',
        title: info?.package_title || 'Umrah Package',
        location: 'Makkah & Madinah',
        priceLabel: `from ${formatMoney(amount, pricing?.currency || 'PKR')}`,
        imageUrl: resolveTourAssetUrl(row.images?.featured_image) || null,
        href: `/packages?id=${row.id}`,
        summary: row.descriptions?.short_description || 'Thoughtfully planned Umrah experience.',
        badge: info?.package_category || info?.package_type || 'Package',
        meta: days ? `${days} days` : null,
        durationLabel,
        ratingLabel: '5.0',
        reviewCount: 1,
        featured: Boolean(info?.featured_package),
        departureDate: row.duration_dates?.departure_date ?? null,
        travelersCapacity: row.booking_info?.available_seats ?? null,
    }
}

export function mapInternationalTourToListing(row: InternationalTourRow): ListingItem {
    const info = row.basic_information
    const pricing = row.pricing
    const amount =
        pricing?.discount_price && pricing.discount_price > 0
            ? pricing.discount_price
            : pricing?.original_price
    const days = row.duration_dates?.duration_days
    const durationLabel = days ? `${days} Day${days > 1 ? 's' : ''}` : null
    const title = info?.package_title || 'International Tour'

    return {
        id: row.id,
        kind: 'international',
        title,
        location: guessInternationalLocation(title, row.descriptions?.short_description),
        priceLabel: `from ${formatMoney(amount, pricing?.currency || 'USD')}`,
        imageUrl: resolveTourAssetUrl(row.images?.featured_image) || null,
        href: `/tours?kind=international&id=${row.id}`,
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
    }
}

export function mapTourToDetail(row: TourRow): TourDetail {
    const price = discountedPrice(row.price_per_seat, row.discount_percent)
    const title = row.header?.title || row.title

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
        priceLabel: formatMoney(price, 'USD'),
        priceAmount: price,
        pricePerSeat: row.price_per_seat ?? 0,
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
