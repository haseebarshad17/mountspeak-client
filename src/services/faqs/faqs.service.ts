import type { SupabaseClient } from '@supabase/supabase-js'

import { FAQ_TYPE_TRAVELERS, type FaqRow } from './faqs.types'

const faqColumns = 'id, agency_id, question, answer, type, created_at, updated_at'

type FaqsServiceProps = {
    supabase: SupabaseClient
    agencyId: string
}

export const faqsService = ({ supabase, agencyId }: FaqsServiceProps) => {
    return {
        getTravelerFaqs: async (): Promise<FaqRow[]> => {
            const { data, error } = await supabase
                .from('faqs')
                .select(faqColumns)
                .eq('agency_id', agencyId)
                .eq('type', FAQ_TYPE_TRAVELERS)
                .order('created_at', { ascending: true })

            if (error) throw error

            return (data ?? []) as FaqRow[]
        },
    }
}
