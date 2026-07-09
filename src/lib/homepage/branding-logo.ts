import type { HomepagePage } from '@/data/homepage'

export type BrandingLogoVariant = 'default' | 'onDark'

export type BrandingLogo = {
    src: string
    alt: string
}

function matchesRoute(pathname: string, route: string): boolean {
    return pathname === route || pathname.startsWith(`${route}/`)
}

/** Bust CDN / Next image cache when branding is updated but the storage path stays the same. */
export function withMediaCacheBust(
    src: string | null | undefined,
    version: string | null | undefined,
): string {
    const trimmed = src?.trim()
    if (!trimmed) return ''

    const cacheVersion = version?.trim()
    if (!cacheVersion) return trimmed

    if (trimmed.startsWith('/images/') || trimmed.startsWith('/branding/')) {
        return trimmed
    }

    const separator = trimmed.includes('?') ? '&' : '?'
    return `${trimmed}${separator}v=${encodeURIComponent(cacheVersion)}`
}

/** Light pages (profile, bookings, checkout) use the default logo on a light header. */
export function shouldUseDefaultBrandingLogo(pathname: string): boolean {
    return (
        matchesRoute(pathname, '/profile') ||
        matchesRoute(pathname, '/dashboard') ||
        matchesRoute(pathname, '/bookings') ||
        matchesRoute(pathname, '/booking')
    )
}

export function getBrandingLogo(
    branding: HomepagePage['branding'],
    variant: BrandingLogoVariant = 'default',
    themeUpdatedAt?: string | null,
): BrandingLogo {
    const selected = branding.logo[variant]
    const fallback = branding.logo.default

    return {
        src: withMediaCacheBust(
            selected?.src?.trim() || fallback.src,
            themeUpdatedAt,
        ),
        alt: selected?.alt?.trim() || fallback.alt || branding.name,
    }
}

export function getHeaderBrandingLogo(
    branding: HomepagePage['branding'],
    pathname: string,
    themeUpdatedAt?: string | null,
): BrandingLogo {
    return getBrandingLogo(
        branding,
        shouldUseDefaultBrandingLogo(pathname) ? 'default' : 'onDark',
        themeUpdatedAt,
    )
}
