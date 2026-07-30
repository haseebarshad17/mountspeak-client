'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/supabase.client'
import {
    getAgencySpecializationCapabilities,
    getAgencySpecializations,
    isValidAgencyId,
} from './specialization.service'

export const specializationQueryKeys = {
    all: ['specializations'] as const,
    agencySpecializations: (agencyId: string) =>
        [...specializationQueryKeys.all, 'agency', agencyId] as const,
    agencyCapabilities: (agencyId: string) =>
        [...specializationQueryKeys.all, 'capabilities', agencyId] as const,
}

export function useGetAgencySpecializations(agencyId?: string) {
    return useQuery({
        queryKey: specializationQueryKeys.agencySpecializations(agencyId ?? ''),
        enabled: isValidAgencyId(agencyId),
        queryFn: () =>
            getAgencySpecializations({ supabase, agencyId: agencyId as string }),
    })
}

export function useGetAgencySpecializationCapabilities(agencyId?: string) {
    return useQuery({
        queryKey: specializationQueryKeys.agencyCapabilities(agencyId ?? ''),
        enabled: isValidAgencyId(agencyId),
        queryFn: () =>
            getAgencySpecializationCapabilities({
                supabase,
                agencyId: agencyId as string,
            }),
    })
}
