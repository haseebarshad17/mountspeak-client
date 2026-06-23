import { useQuery } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase/supabase.client'

import { agencyPaymentService } from './agency-payment.service'

export const agencyPaymentAccountsQueryKey = (agencyId: string | null) =>
    ['agency-payment-accounts', agencyId] as const

export const useAgencyPaymentAccounts = (agencyId: string | null, enabled: boolean) => {
    return useQuery({
        queryKey: agencyPaymentAccountsQueryKey(agencyId),
        enabled: enabled && Boolean(agencyId),
        queryFn: async () => {
            const api = agencyPaymentService({ supabase, agencyId: agencyId! })
            return api.getPaymentAccounts()
        },
        staleTime: 60_000,
    })
}
