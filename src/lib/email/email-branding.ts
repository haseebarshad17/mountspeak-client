import type { SupabaseClient } from '@supabase/supabase-js'
import { clientEnv } from '@/env/client'
import { resolveThemeAssetUrl } from '@/lib/media/resolve-theme-asset'

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
    agencyEmail: string
    agencyPhone: string
    agencyLocation: string
}

/** Ensures image URLs work in email clients (absolute https). */
export function resolveEmailAssetUrl(src: string, siteUrl: string): string {
    const trimmed = src.trim()
    if (!trimmed) return ''

    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return trimmed
    }

    const resolved = resolveThemeAssetUrl(trimmed)
    if (resolved.startsWith('http://') || resolved.startsWith('https://')) {
        return resolved
    }

    const base = siteUrl.replace(/\/$/, '') || clientEnv.SupabaseURL.replace(/\/$/, '')
    if (trimmed.startsWith('/')) {
        return `${base}${trimmed}`
    }

    return `${base}/${trimmed.replace(/^\//, '')}`
}

export function bookingEmailBrandingToTemplateVariables(
    branding: BookingEmailBranding
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
        year,
        site_url: branding.siteUrl,
        agency_email: branding.agencyEmail,
        agency_phone: branding.agencyPhone,
        agency_location: branding.agencyLocation,
    }
}

export async function loadBookingEmailBranding(
    admin: SupabaseClient,
    agencyId: string,
    siteUrlFallback = ''
): Promise<BookingEmailBranding> {
    const [{ data: agency }, { data: themeRow }] = await Promise.all([
        admin
            .from('agencies')
            .select('id, full_name, email, phone')
            .eq('id', agencyId)
            .maybeSingle(),
        admin
            .from('agency_site_theme')
            .select('theme, site_url')
            .eq('agency_id', agencyId)
            .maybeSingle(),
    ])

    const theme = themeRow?.theme as Record<string, unknown> | null
    const page =
        theme && typeof theme === 'object' && theme.page && typeof theme.page === 'object'
            ? (theme.page as Record<string, unknown>)
            : theme
    const branding =
        page && typeof page === 'object' && page.branding && typeof page.branding === 'object'
            ? (page.branding as Record<string, unknown>)
            : null
    const logo =
        branding?.logo && typeof branding.logo === 'object'
            ? (branding.logo as Record<string, unknown>)
            : null
    const logoDefault =
        logo?.default && typeof logo.default === 'object'
            ? (logo.default as Record<string, unknown>)
            : null
    const logoOnDark =
        logo?.onDark && typeof logo.onDark === 'object'
            ? (logo.onDark as Record<string, unknown>)
            : null

    const logoSrc =
        (typeof logoDefault?.src === 'string' && logoDefault.src) ||
        (typeof logoOnDark?.src === 'string' && logoOnDark.src) ||
        ''
    const logoAlt =
        (typeof logoDefault?.alt === 'string' && logoDefault.alt) ||
        (typeof branding?.name === 'string' && branding.name) ||
        agency?.full_name ||
        'Agency logo'

    const agencyName =
        (typeof branding?.name === 'string' && branding.name.trim()) ||
        agency?.full_name?.trim() ||
        'Your travel agency'

    const siteUrl = (themeRow?.site_url || siteUrlFallback || '').replace(/\/$/, '')

    return {
        logoUrl: resolveEmailAssetUrl(logoSrc, siteUrl),
        logoAlt,
        agencyName,
        siteUrl,
        agencyEmail: agency?.email?.trim() || '',
        agencyPhone: agency?.phone?.trim() || '',
        agencyLocation: 'Pakistan',
    }
}
