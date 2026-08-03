import type { SupabaseClient } from '@supabase/supabase-js'
import defaults from '@/content/homepage-defaults.json'
import { buildSiteUrlCandidates } from '@/lib/host/site-url'
import { DEFAULT_TEMPLATE_ID } from '@/lib/templates/resolve-variant'
import type {
    AgencyHomepage,
    AgencySiteThemeRow,
    HomepageDocument,
    HomepagePage,
} from './agency.types'

const COLUMNS =
    'id, agency_id, site_url, theme, specialization_id, branding_logos, created_at, updated_at'

type AgencyServiceProps = {
    supabase: SupabaseClient
}

function normalizeHomepagePage(page: Record<string, unknown>): HomepagePage {
    const defaultsPage = (defaults as HomepageDocument).page
    return {
        ...structuredClone(defaultsPage),
        ...page,
        templateId:
            typeof page.templateId === 'string' && page.templateId.trim()
                ? page.templateId
                : defaultsPage.templateId || 'jedw-cwe-cw',
        sections: {
            ...defaultsPage.sections,
            ...((page.sections as HomepagePage['sections']) ?? {}),
        },
        branding: {
            ...defaultsPage.branding,
            ...((page.branding as HomepagePage['branding']) ?? {}),
        },
        seo: {
            ...defaultsPage.seo,
            ...((page.seo as HomepagePage['seo']) ?? {}),
        },
        theme: {
            ...defaultsPage.theme,
            ...((page.theme as HomepagePage['theme']) ?? {}),
        },
        footer: {
            ...defaultsPage.footer,
            ...((page.footer as HomepagePage['footer']) ?? {}),
        },
    } as HomepagePage
}

function extractPage(theme: unknown): HomepagePage | null {
    if (!theme || typeof theme !== 'object') return null

    const root = theme as Record<string, unknown>

    if (typeof root.sections === 'object' && root.sections !== null) {
        return normalizeHomepagePage(root)
    }

    const nested = root.page
    if (nested && typeof nested === 'object') {
        const page = nested as Record<string, unknown>
        if (typeof page.sections === 'object' && page.sections !== null) {
            return normalizeHomepagePage(page)
        }
    }

    return null
}

export function getDefaultHomepage(requestHost?: string): AgencyHomepage {
    const doc = defaults as HomepageDocument
    const page = structuredClone(doc.page)
    // Always ship Template 1 (Classic / full-bleed) when no agency theme is bound.
    page.templateId = DEFAULT_TEMPLATE_ID

    return {
        agencyId: 'default',
        siteUrl: requestHost ? `http://${requestHost}` : null,
        isAgencySite: false,
        page,
    }
}

export function getAgencyService({ supabase }: AgencyServiceProps) {
    return {
        async getThemeByHost(
            requestHost: string
        ): Promise<AgencySiteThemeRow | null> {
            const candidates = buildSiteUrlCandidates(requestHost)

            const { data, error } = await supabase
                .from('agency_site_theme')
                .select(COLUMNS)
                .in('site_url', candidates)

            if (error) throw error

            const rows = (data as AgencySiteThemeRow[] | null) ?? []
            if (rows.length === 0) return null

            for (const siteUrl of candidates) {
                const match = rows.find((row) => row.site_url === siteUrl)
                if (match) return match
            }

            return rows[0] ?? null
        },

        async getAgencyContent({
            host,
        }: {
            host: string
        }): Promise<AgencyHomepage> {
            try {
                const row = await this.getThemeByHost(host)

                if (!row) return getDefaultHomepage(host)

                // Always keep the real agency_id when a theme row exists —
                // even if CMS JSON is incomplete / missing templateId.
                const page =
                    extractPage(row.theme) ??
                    structuredClone((defaults as HomepageDocument).page)

                return {
                    agencyId: row.agency_id,
                    siteUrl: row.site_url,
                    isAgencySite: true,
                    specializationId: row.specialization_id ?? null,
                    page,
                }
            } catch {
                return getDefaultHomepage(host)
            }
        },

        async getAgencyTheme({ host }: { host: string }) {
            const content = await this.getAgencyContent({ host })
            return {
                templateId: content.page.templateId,
                theme: content.page.theme,
                seo: content.page.seo,
                branding: content.page.branding,
            }
        },
    }
}

/** Server/client helper — pass the matching supabase instance. */
export async function getAgencyContent({
    supabase,
    host,
}: {
    supabase: SupabaseClient
    host: string
}): Promise<AgencyHomepage> {
    return getAgencyService({ supabase }).getAgencyContent({ host })
}

export async function getAgencyTheme({
    supabase,
    host,
}: {
    supabase: SupabaseClient
    host: string
}) {
    return getAgencyService({ supabase }).getAgencyTheme({ host })
}
