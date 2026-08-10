import type { SupabaseClient } from '@supabase/supabase-js'
import { callSupabaseRpc } from '@/lib/api/rpc'
import { MessageCode } from '@/lib/messages/codes'
import type { ConsultUsRecord, SubmitConsultUsPayload } from './consult.types'

export function getConsultService({ supabase }: { supabase: SupabaseClient }) {
    return {
        submitConsultUs: ({ agency_id, ...rest }: SubmitConsultUsPayload) =>
            callSupabaseRpc<ConsultUsRecord>(
                supabase,
                'submit_consult_us',
                { ...rest, p_agency_id: agency_id },
                MessageCode.API_CONSULT_SUBMIT_FAILED
            ),
    }
}
