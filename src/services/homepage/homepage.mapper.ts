import type { HomepagePage } from '@/data/homepage'
import { resolveStorageUrlsDeep } from '@/lib/supabase/resolve-storage-urls'
import { HomepageLoadError } from '@/services/homepage/homepage.errors'
import type { AgencyHomepage, AgencySiteThemeRow } from './homepage.types'

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isHomepagePageShape(value: unknown): value is HomepagePage {
    if (!isRecord(value)) return false
    return (
        typeof value.seo === 'object' &&
        typeof value.theme === 'object' &&
        typeof value.branding === 'object' &&
        typeof value.header === 'object' &&
        typeof value.footer === 'object' &&
        typeof value.sections === 'object'
    )
}

function extractPageFromTheme(theme: unknown): HomepagePage | null {
    if (!isRecord(theme)) return null

    if (isHomepagePageShape(theme)) return theme

    if (isRecord(theme.page) && isHomepagePageShape(theme.page)) {
        return theme.page
    }

    return null
}

/** Fixes values like `http:localhost:3000` → `http://localhost:3000`. */
export function normalizeSiteUrl(siteUrl: string | null | undefined): string | null {
    if (!siteUrl?.trim()) return null

    const trimmed = siteUrl.trim()

    if (/^https?:[^/]/i.test(trimmed)) {
        const protocol = trimmed.startsWith('https:') ? 'https:' : 'http:'
        const rest = trimmed.slice(protocol.length)
        return `${protocol}//${rest.replace(/^\/+/, '')}`
    }

    try {
        return new URL(trimmed).origin
    } catch {
        return trimmed
    }
}

export function mapAgencySiteThemeRowToHomepage(row: AgencySiteThemeRow): AgencyHomepage {
    const page = extractPageFromTheme(row.theme)

    if (!page) {
        throw new HomepageLoadError(
            `agency_site_theme.theme for agency ${row.agency_id} is missing or invalid. Expected a full homepage "page" object.`,
            'INVALID_THEME',
            422,
        )
    }

    return {
        agencyId: row.agency_id,
        siteUrl: normalizeSiteUrl(row.site_url),
        page: resolveStorageUrlsDeep(page),
    }
}

/** @deprecated Use mapAgencySiteThemeRowToHomepage */
export const mapAgencySiteRowToHomepage = mapAgencySiteThemeRowToHomepage
