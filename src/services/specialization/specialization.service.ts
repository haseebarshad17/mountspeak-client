import type { SupabaseClient } from '@supabase/supabase-js'
import {
    buildAgencyCapabilities,
    getDefaultAgencyCapabilities,
} from './specialization.capabilities'
import type {
    AgencySpecializationCapabilities,
    AgencySpecializationRow,
    SpecializationRow,
} from './specialization.types'

type SpecializationServiceProps = {
    supabase: SupabaseClient
}

const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function isValidAgencyId(agencyId: string | null | undefined): boolean {
    if (!agencyId?.trim()) return false
    return UUID_REGEX.test(agencyId.trim())
}

export function getSpecializationService({
    supabase,
}: SpecializationServiceProps) {
    return {
        async getAgencySpecializationLinks(
            agencyId: string
        ): Promise<AgencySpecializationRow[]> {
            if (!isValidAgencyId(agencyId)) return []

            const { data, error } = await supabase
                .from('agency_specializations')
                .select('agency_id, specialization_id, created_at')
                .eq('agency_id', agencyId)

            if (error) throw error
            return (data as AgencySpecializationRow[] | null) ?? []
        },

        async getSpecializationsByIds(
            specializationIds: string[]
        ): Promise<SpecializationRow[]> {
            if (specializationIds.length === 0) return []

            const { data, error } = await supabase
                .from('specializations')
                .select('id, name, description, is_active, created_at, updated_at')
                .in('id', specializationIds)
                .eq('is_active', true)

            if (error) throw error
            return (data as SpecializationRow[] | null) ?? []
        },

        async getAgencySpecializations(agencyId: string): Promise<SpecializationRow[]> {
            const links = await this.getAgencySpecializationLinks(agencyId)
            const ids = [...new Set(links.map((item) => item.specialization_id))]
            return this.getSpecializationsByIds(ids)
        },
    }
}

export async function getAgencySpecializations({
    supabase,
    agencyId,
}: {
    supabase: SupabaseClient
    agencyId: string
}) {
    return getSpecializationService({ supabase }).getAgencySpecializations(agencyId)
}

export async function getAgencySpecializationCapabilities({
    supabase,
    agencyId,
}: {
    supabase: SupabaseClient
    agencyId: string
}): Promise<AgencySpecializationCapabilities> {
    if (!isValidAgencyId(agencyId)) {
        return getDefaultAgencyCapabilities()
    }

    try {
        const specializations = await getAgencySpecializations({ supabase, agencyId })
        return buildAgencyCapabilities(specializations)
    } catch {
        return getDefaultAgencyCapabilities()
    }
}
