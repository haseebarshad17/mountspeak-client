const LOCAL_DEV_HOSTNAMES = new Set(['localhost', '127.0.0.1', '0.0.0.0'])

export const AGENCY_PREVIEW_HOST_COOKIE = 'agency-preview-host'

/** Matches hostname-style path segments, e.g. trip-connect-agency-site.vercel.app */
const AGENCY_HOST_SEGMENT =
    /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i

export type AgencyPreviewContext = {
    agencyHost: string
    previewBase: string
    internalPathname: string
}

export function isLocalDevHostname(hostname: string): boolean {
    return LOCAL_DEV_HOSTNAMES.has(hostname.toLowerCase())
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

export function getHostnameFromHostHeader(hostHeader: string | null): string {
    return hostHeader?.split(':')[0]?.toLowerCase() ?? ''
}

export function getAgencyPreviewHostFromPathname(pathname: string): string | null {
    return resolveAgencyPreviewFromPathname(pathname)?.agencyHost ?? null
}
