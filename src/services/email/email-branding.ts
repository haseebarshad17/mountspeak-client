import type { HomepagePage } from '@/data/homepage'
import type { AgencyHomepage } from '@/services/homepage/homepage.types'

/** Platform operator shown in the email footer (below agency copyright). */
export const EMAIL_PLATFORM_BRAND = {
    name: 'Mountspeak',
    address: '234-C PIA Main Boulevard, Block C Phase 1 Johar Town, Lahore, Pakistan',
} as const

export type BookingEmailBranding = {
    logoUrl: string
    logoAlt: string
    agencyName: string
    siteUrl: string
}

/** Ensures image URLs work in email clients (absolute https). */
export function resolveEmailAssetUrl(src: string, siteUrl: string): string {
    const trimmed = src.trim()
    if (!trimmed) return ''

    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return trimmed
    }

    const base = siteUrl.replace(/\/$/, '')
    if (trimmed.startsWith('/')) {
        return `${base}${trimmed}`
    }

    return `${base}/${trimmed.replace(/^\//, '')}`
}

export function resolveBookingEmailBrandingFromHomepage(
    homepage: Pick<AgencyHomepage, 'page' | 'siteUrl'>,
    fallbackSiteUrl = '',
): BookingEmailBranding {
    const siteUrl = (homepage.siteUrl ?? fallbackSiteUrl).replace(/\/$/, '')
    const { branding } = homepage.page
    const logoSrc = branding.logo.default.src || branding.logo.onDark.src

    return {
        logoUrl: resolveEmailAssetUrl(logoSrc, siteUrl),
        logoAlt: branding.logo.default.alt || branding.name,
        agencyName: branding.name,
        siteUrl,
    }
}

export function resolveBookingEmailBrandingFromPage(
    page: HomepagePage,
    siteUrl: string,
): BookingEmailBranding {
    return resolveBookingEmailBrandingFromHomepage({ page, siteUrl }, siteUrl)
}

export function bookingEmailBrandingToTemplateVariables(
    branding: BookingEmailBranding,
): Record<string, string> {
    const year = String(new Date().getFullYear())

    return {
        agency_logo: branding.logoUrl,
        logo_url: branding.logoUrl,
        logo_alt: branding.logoAlt,
        agency_name: branding.agencyName,
        brand_name: branding.agencyName,
        platform_name: EMAIL_PLATFORM_BRAND.name,
        platform_address: EMAIL_PLATFORM_BRAND.address,
        current_year: year,
        site_url: branding.siteUrl,
    }
}
