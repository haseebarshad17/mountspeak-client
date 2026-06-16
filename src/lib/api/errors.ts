import type { PostgrestError } from '@supabase/supabase-js'

import { getMessage } from '@/lib/messages/get-message'
import { MessageCode, type MessageCodeValue } from '@/lib/messages/codes'

export class ApiError extends Error {
    readonly code?: string
    readonly details?: string | null

    constructor(message: string, code?: string, details?: string | null) {
        super(message)
        this.name = 'ApiError'
        this.code = code
        this.details = details
    }
}

export function isPostgrestError(error: unknown): error is PostgrestError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as PostgrestError).message === 'string'
    )
}

export function getApiErrorMessage(
    _error: unknown,
    code: MessageCodeValue = MessageCode.API_GENERIC,
): string {
    return getMessage(code)
}

export function toApiError(error: unknown, code: MessageCodeValue = MessageCode.API_GENERIC): ApiError {
    if (error instanceof ApiError) return error
    return new ApiError(getMessage(code), code)
}
