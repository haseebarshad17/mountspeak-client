import type { SupabaseClient } from '@supabase/supabase-js'

import { mapAgencyPaymentAccounts } from './agency-payment.mapper'
import type { AgencyPaymentAccount } from './agency-payment.types'

type AgencyPaymentServiceProps = {
    supabase: SupabaseClient
    agencyId: string
}

export const agencyPaymentService = ({ supabase, agencyId }: AgencyPaymentServiceProps) => {
    return {
        getPaymentAccounts: async (): Promise<AgencyPaymentAccount[]> => {
            const { data, error } = await supabase
                .from('agency_site_theme')
                .select('payment')
                .eq('agency_id', agencyId)
                .maybeSingle()

            if (error) throw error

            return mapAgencyPaymentAccounts(data?.payment)
        },
    }
}
