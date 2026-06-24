import {
    isAgencyPreviewPlatformHost,
    stripAgencyPreviewBase,
} from '@/lib/homepage/agency-preview'
import type { NextRequest } from 'next/server'

export function normalizeSiteUrl(url: string): string {
    return url.replace(/\/$/, '')
}

/** Client-side app origin from the current browser location. */
export function getClientSiteUrl(): string {
    if (typeof window !== 'undefined') {
        return window.location.origin
    }

    return ''
}

export type AuthSiteUrlOptions = {
    previewAgencyHost?: string | null
    isAgencySite?: boolean | null
}

/** Prefer canonical agency siteUrl from homepage when available. */
export function getAuthSiteUrl(
    homepageSiteUrl: string | null | undefined,
    options?: AuthSiteUrlOptions,
): string {
    if (homepageSiteUrl?.trim()) {
        return normalizeSiteUrl(homepageSiteUrl)
    }

    const previewHost = options?.previewAgencyHost?.trim()
    if (previewHost) {
        return normalizeSiteUrl(`https://${previewHost.replace(/^https?:\/\//, '')}`)
    }

    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname
        if (!isAgencyPreviewPlatformHost(hostname)) {
            return window.location.origin
        }
    }

    if (options?.isAgencySite) {
        return ''
    }

    return getClientSiteUrl()
}

/** Server-side app origin for auth redirects (OAuth callback, emails). */
export function getServerSiteUrl(request: NextRequest): string {
    const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim()
    const forwardedProto = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim() ?? 'https'
    if (forwardedHost) {
        return normalizeSiteUrl(`${forwardedProto}://${forwardedHost}`)
    }

    return normalizeSiteUrl(request.nextUrl.origin)
}

/** Strips `/{agency-host}/` preview prefix from paths used in auth email/OAuth redirects. */
export function normalizeAuthRedirectPath(path: string): string {
    const withLeadingSlash = path.startsWith('/') ? path : `/${path}`
    const stripped = stripAgencyPreviewBase(withLeadingSlash)
    return stripped.startsWith('/') ? stripped : '/'
}

export function buildAuthCallbackUrl(siteUrl: string, nextPath = '/dashboard'): string {
    const safeNextPath = normalizeAuthRedirectPath(
        nextPath.startsWith('/') ? nextPath : '/dashboard',
    )
    const url = new URL('/auth/callback', siteUrl)
    url.searchParams.set('next', safeNextPath)
    return url.toString()
}
