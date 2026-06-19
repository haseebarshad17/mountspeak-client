import { useQuery } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase/supabase.client'

import { faqsService } from './faqs.service'

export const travelerFaqsQueryKey = (agencyId: string | null) =>
    ['traveler-faqs', agencyId] as const

export const useTravelerFaqs = (agencyId: string | null, enabled: boolean) => {
    return useQuery({
        queryKey: travelerFaqsQueryKey(agencyId),
        enabled: enabled && Boolean(agencyId),
        queryFn: async () => {
            const api = faqsService({ supabase, agencyId: agencyId! })
            return api.getTravelerFaqs()
        },
        staleTime: 60_000,
    })
}
