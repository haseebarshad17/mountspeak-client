import { cache } from 'react'
import { unstable_cache } from 'next/cache'

import { createDefaultAgencyHomepage } from '@/lib/homepage/default-homepage'
import { getRequestSiteHost } from '@/lib/homepage/resolve-request-host'
import { createPublicSupabase } from '@/lib/supabase/supabase.public.server'

import { mapAgencySiteThemeRowToHomepage } from './homepage.mapper'
import { homepageService } from './homepage.service'
import type { AgencyHomepage } from './homepage.types'
import { fetchSpecializations } from '@/services/specializations/specializations.server'
import { resolveAgencySpecializationIds } from '@/lib/homepage/specialization'

const HOMEPAGE_REVALIDATE_SECONDS = 120

async function loadAgencySpecializationIds(
    supabase: ReturnType<typeof createPublicSupabase>,
    agencyId: string,
    primarySpecializationId: string | null,
): Promise<string[]> {
    try {
        const { data, error } = await supabase.rpc('get_public_agency_specialization_ids', {
            p_agency_id: agencyId,
        })

        if (error) throw error

        const ids = Array.isArray(data)
            ? data.map((id) => String(id).trim()).filter(Boolean)
            : []

        return resolveAgencySpecializationIds(primarySpecializationId, ids)
    } catch {
        return resolveAgencySpecializationIds(primarySpecializationId, [])
    }
}

async function resolveRequestHost(): Promise<string> {
    try {
        return await getRequestSiteHost()
    } catch {
        return process.env.VERCEL_URL?.toLowerCase() ?? 'localhost:3000'
    }
}

async function loadAgencyHomepageForHost(requestHost: string): Promise<AgencyHomepage> {
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
                agencySpecializationIds: [],
            }
        }

        try {
            const homepage = mapAgencySiteThemeRowToHomepage(row)
            const specializationId = row.specialization_id?.trim() || null
            const agencySpecializationIds = await loadAgencySpecializationIds(
                supabase,
                homepage.agencyId,
                specializationId,
            )

            return {
                ...homepage,
                specializationId,
                agencySpecializationIds,
                specializations,
            }
        } catch {
            return {
                ...createDefaultAgencyHomepage(requestHost),
                specializations,
                agencySpecializationIds: [],
            }
        }
    } catch {
        return createDefaultAgencyHomepage(requestHost)
    }
}

function getCachedAgencyHomepageForHost(requestHost: string): Promise<AgencyHomepage> {
    return unstable_cache(
        () => loadAgencyHomepageForHost(requestHost),
        ['agency-homepage', requestHost],
        {
            revalidate: HOMEPAGE_REVALIDATE_SECONDS,
            tags: [`agency-homepage:${requestHost}`],
        },
    )()
}

export const fetchAgencyHomepage = cache(async (): Promise<AgencyHomepage> => {
    const requestHost = await resolveRequestHost()
    return getCachedAgencyHomepageForHost(requestHost)
})

/** Explicit host lookup for localhost preview (`?host=` API) and tests. */
export const fetchAgencyHomepageForHost = cache(
    async (requestHost: string): Promise<AgencyHomepage> => {
        return getCachedAgencyHomepageForHost(requestHost.toLowerCase().trim())
    },
)
