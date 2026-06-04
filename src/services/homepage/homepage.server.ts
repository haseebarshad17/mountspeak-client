import { cache } from 'react'

import { getRequestSiteHost } from '@/lib/homepage/resolve-request-host'
import { createPublicSupabase } from '@/lib/supabase/supabase.public.server'

import { HomepageLoadError } from './homepage.errors'
import { mapAgencySiteThemeRowToHomepage } from './homepage.mapper'
import { homepageService } from './homepage.service'
import type { AgencyHomepage } from './homepage.types'

async function fetchAgencyHomepageUncached(): Promise<AgencyHomepage> {
    const requestHost = await getRequestSiteHost()

    try {
        const supabase = createPublicSupabase()
        const api = homepageService({ supabase })
        const row = await api.getAgencySiteThemeByRequestHost(requestHost)

        if (!row) {
            throw new HomepageLoadError(
                `No agency_site_theme row matches host "${requestHost}". Set site_url in Supabase to match this deployment.`,
                'SITE_NOT_FOUND',
                404,
            )
        }

        return mapAgencySiteThemeRowToHomepage(row)
    } catch (error) {
        if (error instanceof HomepageLoadError) throw error

        const message = error instanceof Error ? error.message : 'Failed to load homepage from Supabase'
        throw new HomepageLoadError(message, 'SUPABASE_ERROR', 500)
    }
}

export const fetchAgencyHomepage = cache(fetchAgencyHomepageUncached)
