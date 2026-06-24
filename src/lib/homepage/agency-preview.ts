const LOCAL_DEV_HOSTNAMES = new Set(['localhost', '127.0.0.1', '0.0.0.0'])

/** Platform hosts that support `/{site-url}/...` agency preview paths. */
const PLATFORM_HOST_FALLBACKS = ['trip-connect-agency-site.vercel.app']

export const AGENCY_PREVIEW_HOST_COOKIE = 'agency-preview-host'

export function readAgencyPreviewHostCookie(): string | null {
    if (typeof document === 'undefined') return null

    const match = document.cookie.match(
        new RegExp(`(?:^|; )${AGENCY_PREVIEW_HOST_COOKIE}=([^;]*)`),
    )

    return match?.[1] ? decodeURIComponent(match[1]) : null
}

/** Matches hostname-style path segments, e.g. trip-connect-agency-site.vercel.app or my-agency.com */
const AGENCY_HOST_SEGMENT =
    /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i

export type AgencyPreviewContext = {
    agencyHost: string
    previewBase: string
    internalPathname: string
}

function parseHostnameFromSiteConfig(value: string): string | null {
    try {
        const url = value.includes('://') ? new URL(value) : new URL(`https://${value}`)
        return url.hostname.toLowerCase()
    } catch {
        return value.split(':')[0]?.toLowerCase() || null
    }
}

export function getAgencyPreviewPlatformHostnames(): Set<string> {
    const hosts = new Set<string>(PLATFORM_HOST_FALLBACKS)

    for (const raw of [process.env.NEXT_PUBLIC_SITE_URL, process.env.VERCEL_URL]) {
        if (!raw) continue
        const hostname = parseHostnameFromSiteConfig(raw)
        if (hostname) hosts.add(hostname)
    }

    return hosts
}

export function isLocalDevHostname(hostname: string): boolean {
    return LOCAL_DEV_HOSTNAMES.has(hostname.toLowerCase())
}

/** True when `/{registered-site-url}/...` preview paths are supported on this host. */
export function isAgencyPreviewPlatformHost(hostname: string): boolean {
    const normalized = hostname.toLowerCase()
    if (isLocalDevHostname(normalized)) return true
    return getAgencyPreviewPlatformHostnames().has(normalized)
}

export function isAgencyHostPathSegment(segment: string): boolean {
    return AGENCY_HOST_SEGMENT.test(segment)
}

export function resolveAgencyPreviewFromPathname(
    pathname: string,
): AgencyPreviewContext | null {
    const segments = pathname.split('/').filter(Boolean)
    const first = segments[0]

    if (!first || !isAgencyHostPathSegment(first)) {
        return null
    }

    const rest = segments.slice(1)
    const internalPathname = rest.length === 0 ? '/' : `/${rest.join('/')}`

    return {
        agencyHost: first.toLowerCase(),
        previewBase: `/${first}`,
        internalPathname,
    }
}

export function resolveAgencyPreviewForRequest(
    pathname: string,
    requestHostname: string,
): AgencyPreviewContext | null {
    if (!isAgencyPreviewPlatformHost(requestHostname)) {
        return null
    }

    return resolveAgencyPreviewFromPathname(pathname)
}

export function stripAgencyPreviewBase(pathname: string): string {
    return resolveAgencyPreviewFromPathname(pathname)?.internalPathname ?? pathname
}

export function prefixHref(href: string, previewBase: string | null | undefined): string {
    if (!previewBase || !href.startsWith('/') || href.startsWith('//')) {
        return href
    }

    if (href === previewBase || href.startsWith(`${previewBase}/`)) {
        return href
    }

    return `${previewBase}${href === '/' ? '' : href}`
}

export function isBookingRoute(pathname: string): boolean {
    return pathname === '/booking' || pathname.startsWith('/booking/')
}

export function getHostnameFromHostHeader(hostHeader: string | null): string {
    return hostHeader?.split(':')[0]?.toLowerCase() ?? ''
}

export function getAgencyPreviewHostFromPathname(pathname: string): string | null {
    const requestHostname =
        typeof window !== 'undefined' ? window.location.hostname : ''

    const fromPath = resolveAgencyPreviewForRequest(pathname, requestHostname)?.agencyHost
    if (fromPath) return fromPath

    if (typeof window !== 'undefined' && isAgencyPreviewPlatformHost(requestHostname)) {
        return readAgencyPreviewHostCookie()
    }

    return null
}
