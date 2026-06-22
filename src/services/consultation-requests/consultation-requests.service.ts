import type { SupabaseClient } from '@supabase/supabase-js'

import { assertRpcSuccess, callSupabaseRpc } from '@/lib/api/rpc'
import { MessageCode } from '@/lib/messages/codes'

import { SUBMIT_CONSULT_US_RPC } from './consultation-requests.constants'
import type {
    CreateConsultationRequestDTO,
    SubmitConsultationRpcResponse,
} from './consultation-requests.types'

type ConsultationRequestsServiceProps = {
    supabase: SupabaseClient
}

function toRpcArgs(payload: CreateConsultationRequestDTO) {
    return {
        name: payload.name.trim(),
        email: payload.email.trim().toLowerCase(),
        phone: payload.phone.trim(),
        title: payload.title.trim(),
        description: payload.description.trim(),
        inquiry_type: payload.inquiry_type ?? null,
        agency_id: payload.agency_id ?? null,
    }
}

export const consultationRequestsService = ({ supabase }: ConsultationRequestsServiceProps) => {
    return {
        /**
         * Calls public.submit_consult_us RPC (insert + email queue + RLS-safe path).
         */
        submitConsultationRequest: async (
            payload: CreateConsultationRequestDTO,
        ): Promise<SubmitConsultationRpcResponse> => {
            const data = await callSupabaseRpc<SubmitConsultationRpcResponse>(
                supabase,
                SUBMIT_CONSULT_US_RPC,
                toRpcArgs(payload),
                MessageCode.API_CONTACT_SUBMIT_FAILED,
            )

            return assertRpcSuccess(data, MessageCode.API_CONTACT_SUBMIT_FAILED)
        },
    }
}
