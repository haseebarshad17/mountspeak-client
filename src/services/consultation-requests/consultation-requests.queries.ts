import { useMutation } from '@tanstack/react-query'

import { ApiError, getApiErrorMessage } from '@/lib/api/errors'
import { MessageCode } from '@/lib/messages/codes'

import type {
    CreateConsultationRequestDTO,
    SubmitConsultationRpcResponse,
} from './consultation-requests.types'

async function submitConsultationRequest(
    payload: CreateConsultationRequestDTO,
): Promise<SubmitConsultationRpcResponse> {
    const response = await fetch('/api/consultation-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })

    if (!response.ok) {
        throw new ApiError(
            getApiErrorMessage(null, MessageCode.API_CONTACT_SUBMIT_FAILED),
            MessageCode.API_CONTACT_SUBMIT_FAILED,
        )
    }

    return (await response.json()) as SubmitConsultationRpcResponse
}

export const useCreateConsultationRequest = () => {
    return useMutation({
        mutationFn: submitConsultationRequest,
        meta: {
            getErrorMessage: (error: unknown) =>
                getApiErrorMessage(error, MessageCode.API_CONTACT_SUBMIT_FAILED),
        },
    })
}
