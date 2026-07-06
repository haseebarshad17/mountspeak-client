import type { SupabaseClient } from '@supabase/supabase-js'

import { buildSiteUrlLookupCandidates } from '@/lib/homepage/site-url-candidates'
import type { AgencySiteThemeRow } from './homepage.types'

type HomepageServiceProps = {
    supabase: SupabaseClient
}

const agencySiteThemeColumns =
    'id, agency_id, site_url, theme, specialization_id, branding_logos, created_at, updated_at'

export const homepageService = ({ supabase }: HomepageServiceProps) => {
    return {
        /**
         * GET /rest/v1/agency_site_theme?site_url=eq.{url}
         */
        getAgencySiteThemeByRequestHost: async (
            requestHost: string,
        ): Promise<AgencySiteThemeRow | null> => {
            const candidates = buildSiteUrlLookupCandidates(requestHost)

            for (const siteUrl of candidates) {
                const { data, error } = await supabase
                    .from('agency_site_theme')
                    .select(agencySiteThemeColumns)
                    .eq('site_url', siteUrl)
                    .maybeSingle()

                if (error) throw error
                if (data) {
                    return data as AgencySiteThemeRow
                }
            }

            const { data, error } = await supabase
                .from('agency_site_theme')
                .select(agencySiteThemeColumns)
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
    }
}
