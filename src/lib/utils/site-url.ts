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

export function buildAuthCallbackUrl(siteUrl: string, nextPath = '/dashboard'): string {
    const safeNextPath = nextPath.startsWith('/') ? nextPath : '/dashboard'
    const url = new URL('/auth/callback', siteUrl)
    url.searchParams.set('next', safeNextPath)
    return url.toString()
}
