import { useMutation } from '@tanstack/react-query'

import { getApiErrorMessage } from '@/lib/api/errors'

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
        let message = 'Unable to submit consultation request.'
        try {
            const body = (await response.json()) as { error?: string }
            if (body.error) message = body.error
        } catch {
            // ignore
        }
        throw new Error(message)
    }

    return (await response.json()) as SubmitConsultationRpcResponse
}

export const useCreateConsultationRequest = () => {
    return useMutation({
        mutationFn: submitConsultationRequest,
        meta: {
            getErrorMessage: getApiErrorMessage,
        },
    })
}
