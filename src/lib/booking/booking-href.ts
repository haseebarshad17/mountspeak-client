import type { SpecializationKind } from '@/services/specialization/specialization.types'

export function buildTourBookingHref(params: {
    slug: string
    adults?: number
    children?: number
    slot?: string | null
}) {
    const query = new URLSearchParams()
    query.set('tour', params.slug)
    if (params.adults != null) query.set('adults', String(params.adults))
    if (params.children != null) query.set('children', String(params.children))
    if (params.slot) query.set('slot', params.slot)
    return `/booking?${query.toString()}`
}

export function buildBookingRequestHref(params: {
    kind: 'packages' | 'international' | 'umrah'
    id: string
    title?: string
}) {
    const listingKind =
        params.kind === 'packages' || params.kind === 'umrah' ? 'umrah' : 'international'
    const query = new URLSearchParams()
    query.set('kind', listingKind)
    query.set('id', params.id)
    if (params.title) query.set('title', params.title)
    return `/booking/request?${query.toString()}`
}

export function bookingHrefForListing(params: {
    kind: SpecializationKind
    id: string
    slugOrHref?: string
    title?: string
}) {
    if (params.kind === 'tours') {
        const slug =
            params.slugOrHref?.replace(/^\/tours\//, '').split('?')[0] || params.id
        return buildTourBookingHref({ slug })
    }
    return buildBookingRequestHref({
        kind: params.kind,
        id: params.id,
        title: params.title,
    })
}
