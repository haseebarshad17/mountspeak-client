import { getMessage } from '@/lib/messages/get-message'
import { MessageCode, type MessageCodeValue } from '@/lib/messages/codes'

export class ApiError extends Error {
    readonly code?: string

    constructor(message: string, code?: string) {
        super(message)
        this.name = 'ApiError'
        this.code = code
    }
}

export function getApiErrorMessage(
    error: unknown,
    code: MessageCodeValue = MessageCode.API_GENERIC
): string {
    if (error instanceof ApiError && error.message) return error.message
    if (error instanceof Error && error.message) return error.message
    return getMessage(code)
}

export function toApiError(
    error: unknown,
    code: MessageCodeValue = MessageCode.API_GENERIC
): ApiError {
    if (error instanceof ApiError) return error
    return new ApiError(getMessage(code), code)
}
