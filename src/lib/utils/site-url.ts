import {
    isAgencyPreviewPlatformHost,
    stripAgencyPreviewBase,
} from '@/lib/homepage/agency-preview'
import type { NextRequest } from 'next/server'

/**
 * Supabase Auth redirect allow-list (staging: jywyypumeyyrfftcbzkm.supabase.co):
 * - Site URL: http://localhost:3000 (no /{agency-host} path segment)
 * - Redirect URLs: http://localhost:3000/auth/callback, https://{agency-domain}/auth/callback,
 *   and wildcards like http://localhost:3000/**
 */

export function normalizeSiteUrl(url: string): string {
    return url.replace(/\/$/, '')
}

/** Extracts origin only; guards against malformed values like http://localhost:3000/myagency.com */
export function toAuthOrigin(siteUrl: string): string {
    const trimmed = siteUrl.trim()
    if (!trimmed) return ''

    try {
        const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
        return normalizeSiteUrl(new URL(withProtocol).origin)
    } catch {
        return normalizeSiteUrl(trimmed)
    }
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

function resolveCanonicalAgencySiteUrl(
    homepageSiteUrl: string | null | undefined,
    options?: AuthSiteUrlOptions,
): string {
    if (homepageSiteUrl?.trim()) {
        return toAuthOrigin(homepageSiteUrl)
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

/** Canonical agency origin for auth emails (signup, resend, magic link). */
export function getAuthEmailSiteUrl(
    homepageSiteUrl: string | null | undefined,
    options?: AuthSiteUrlOptions,
): string {
    return resolveCanonicalAgencySiteUrl(homepageSiteUrl, options)
}

/** Platform origin for OAuth callback redirects (never preview-path prefixed). */
export function getAuthCallbackOrigin(
    homepageSiteUrl: string | null | undefined,
    options?: AuthSiteUrlOptions,
): string {
    if (typeof window !== 'undefined') {
        return window.location.origin
    }

    if (homepageSiteUrl?.trim()) {
        return toAuthOrigin(homepageSiteUrl)
    }

    const previewHost = options?.previewAgencyHost?.trim()
    if (previewHost) {
        return normalizeSiteUrl(`https://${previewHost.replace(/^https?:\/\//, '')}`)
    }

    return getClientSiteUrl()
}

/** @deprecated Use getAuthEmailSiteUrl or getAuthCallbackOrigin */
export function getAuthSiteUrl(
    homepageSiteUrl: string | null | undefined,
    options?: AuthSiteUrlOptions,
): string {
    return getAuthEmailSiteUrl(homepageSiteUrl, options)
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

export function buildAuthCallbackUrl(
    siteUrl: string,
    nextPath = '/dashboard',
    agencyId?: string | null,
): string {
    const origin = toAuthOrigin(siteUrl)
    const safeNextPath = normalizeAuthRedirectPath(
        nextPath.startsWith('/') ? nextPath : '/dashboard',
    )
    const url = new URL('/auth/callback', origin)
    url.searchParams.set('next', safeNextPath)

    const trimmedAgencyId = agencyId?.trim()
    if (
        trimmedAgencyId &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            trimmedAgencyId,
        )
    ) {
        url.searchParams.set('agency_id', trimmedAgencyId)
    }

    return url.toString()
}
