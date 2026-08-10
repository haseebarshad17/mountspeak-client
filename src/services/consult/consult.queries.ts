'use client'

import { useMutation } from '@tanstack/react-query'
import { getApiErrorMessage } from '@/lib/api/errors'
import { MessageCode } from '@/lib/messages/codes'
import { supabase } from '@/lib/supabase/supabase.client'
import { getConsultService } from './consult.service'
import type { SubmitConsultUsPayload } from './consult.types'

const consultService = getConsultService({ supabase })

export function useSubmitConsultUs() {
    return useMutation({
        mutationFn: (payload: SubmitConsultUsPayload) =>
            consultService.submitConsultUs(payload),
        meta: {
            getErrorMessage: (error: unknown) =>
                getApiErrorMessage(error, MessageCode.API_CONSULT_SUBMIT_FAILED),
        },
    })
}
