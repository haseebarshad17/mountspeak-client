import { cache } from 'react'

import { createDefaultAgencyHomepage } from '@/lib/homepage/default-homepage'
import { getRequestSiteHost } from '@/lib/homepage/resolve-request-host'
import { createPublicSupabase } from '@/lib/supabase/supabase.public.server'

import { mapAgencySiteThemeRowToHomepage } from './homepage.mapper'
import { homepageService } from './homepage.service'
import type { AgencyHomepage } from './homepage.types'

async function resolveRequestHost(): Promise<string> {
    try {
        return await getRequestSiteHost()
    } catch {
        return process.env.VERCEL_URL?.toLowerCase() ?? 'localhost:3000'
    }
}

async function fetchAgencyHomepageUncached(): Promise<AgencyHomepage> {
    const requestHost = await resolveRequestHost()

    try {
        const supabase = createPublicSupabase()
        const api = homepageService({ supabase })
        const row = await api.getAgencySiteThemeByRequestHost(requestHost)

        if (!row) {
            return createDefaultAgencyHomepage(requestHost)
        }

        try {
            return mapAgencySiteThemeRowToHomepage(row)
        } catch {
            return createDefaultAgencyHomepage(requestHost)
        }
    } catch {
        return createDefaultAgencyHomepage(requestHost)
    }
}

export const fetchAgencyHomepage = cache(fetchAgencyHomepageUncached)
