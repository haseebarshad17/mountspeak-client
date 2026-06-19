import { cache } from 'react'
import { unstable_noStore as noStore } from 'next/cache'

import { resolveSelectedSpecialization } from '@/lib/homepage/specialization'
import { createDefaultAgencyHomepage } from '@/lib/homepage/default-homepage'
import { getRequestSiteHost } from '@/lib/homepage/resolve-request-host'
import { createPublicSupabase } from '@/lib/supabase/supabase.public.server'

import { mapAgencySiteThemeRowToHomepage } from './homepage.mapper'
import { homepageService } from './homepage.service'
import type { AgencyHomepage } from './homepage.types'
import { fetchSpecializations } from '@/services/specializations/specializations.server'

async function resolveRequestHost(): Promise<string> {
    try {
        return await getRequestSiteHost()
    } catch {
        return process.env.VERCEL_URL?.toLowerCase() ?? 'localhost:3000'
    }
}

async function loadAgencyHomepageForHost(requestHost: string): Promise<AgencyHomepage> {
    noStore()

    try {
        const supabase = createPublicSupabase()
        const api = homepageService({ supabase })
        const [row, specializations] = await Promise.all([
            api.getAgencySiteThemeByRequestHost(requestHost),
            fetchSpecializations(),
        ])

        if (!row) {
            return {
                ...createDefaultAgencyHomepage(requestHost),
                specializations,
            }
        }

        try {
            const homepage = mapAgencySiteThemeRowToHomepage(row)
            const specializationId = row.specialization_id?.trim() || null
            const selectedSpecialization = resolveSelectedSpecialization(
                specializationId,
                specializations,
            )

            console.log('[specialization_id] selected option', {
                specializationId,
                selectedOption: selectedSpecialization,
            })

            return {
                ...homepage,
                specializationId,
                specializations,
            }
        } catch {
            return {
                ...createDefaultAgencyHomepage(requestHost),
                specializations,
            }
        }
    } catch {
        return createDefaultAgencyHomepage(requestHost)
    }
}

export const fetchAgencyHomepage = cache(async (): Promise<AgencyHomepage> => {
    const requestHost = await resolveRequestHost()
    return loadAgencyHomepageForHost(requestHost)
})

/** Explicit host lookup for localhost preview (`?host=` API) and tests. */
export const fetchAgencyHomepageForHost = cache(
    async (requestHost: string): Promise<AgencyHomepage> => {
        return loadAgencyHomepageForHost(requestHost.toLowerCase().trim())
    },
)
