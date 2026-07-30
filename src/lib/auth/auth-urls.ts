import { isValidAgencyId } from '@/services/specialization/specialization.service'

export function normalizeAuthRedirectPath(path: string | null | undefined): string {
    if (!path?.startsWith('/')) return '/'
    if (path.startsWith('//')) return '/'
    return path
}

export function buildAuthCallbackUrl({
    origin,
    next = '/',
    agencyId,
    host,
}: {
    origin: string
    next?: string
    agencyId?: string | null
    host?: string | null
}) {
    const base = origin.replace(/\/$/, '')
    const url = new URL(`${base}/auth/callback`)
    url.searchParams.set('next', normalizeAuthRedirectPath(next))
    if (agencyId && isValidAgencyId(agencyId)) {
        url.searchParams.set('agency_id', agencyId)
    }
    if (host?.trim()) {
        url.searchParams.set('host', host.trim())
    }
    return url.toString()
}

export function getBrowserOrigin() {
    if (typeof window === 'undefined') return 'http://localhost:3000'
    return window.location.origin
}
