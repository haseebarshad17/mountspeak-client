import { stripAgencyPreviewBase } from '@/lib/homepage/agency-preview'
import type { NextRequest } from 'next/server'

export function normalizeSiteUrl(url: string): string {
    return url.replace(/\/$/, '')
}

/** Client-side app origin. Prefer NEXT_PUBLIC_SITE_URL in production. */
export function getClientSiteUrl(): string {
    const configured = process.env.NEXT_PUBLIC_SITE_URL
    if (configured) return normalizeSiteUrl(configured)

    if (typeof window !== 'undefined') {
        return window.location.origin
    }

    return ''
}

/** Prefer canonical agency siteUrl from homepage when available. */
export function getAuthSiteUrl(siteUrl: string | null | undefined): string {
    return normalizeSiteUrl(siteUrl?.trim() || getClientSiteUrl())
}

/** Server-side app origin for auth redirects (OAuth callback, emails). */
export function getServerSiteUrl(request: NextRequest): string {
    const configured = process.env.NEXT_PUBLIC_SITE_URL
    if (configured) return normalizeSiteUrl(configured)

    const forwardedHost = request.headers.get('x-forwarded-host')
    const forwardedProto = request.headers.get('x-forwarded-proto') ?? 'https'
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
