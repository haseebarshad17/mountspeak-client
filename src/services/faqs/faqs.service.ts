import type { SupabaseClient } from '@supabase/supabase-js'
import type { FaqAudience, FaqItem, FaqRow } from './faqs.types'

const FAQS_COLUMNS = 'id, agency_id, question, answer, type, created_at, updated_at'

function mapFaqRow(row: FaqRow): FaqItem {
    return { id: row.id, question: row.question, answer: row.answer }
}

export function getFaqsService({ supabase }: { supabase: SupabaseClient }) {
    return {
        async getFaqs(agencyId: string, type: FaqAudience = 'travelers'): Promise<FaqItem[]> {
            if (!agencyId?.trim()) return []

            const { data, error } = await supabase
                .from('faqs')
                .select(FAQS_COLUMNS)
                .eq('agency_id', agencyId)
                .eq('type', type)
                .order('created_at', { ascending: true })

            if (error) throw error
            return ((data as FaqRow[] | null) ?? []).map(mapFaqRow)
        },
    }
}

export async function getTravelerFaqs({
    supabase,
    agencyId,
}: {
    supabase: SupabaseClient
    agencyId: string
}): Promise<FaqItem[]> {
    try {
        return await getFaqsService({ supabase }).getFaqs(agencyId, 'travelers')
    } catch {
        return []
    }
}
