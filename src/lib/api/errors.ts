import type { PostgrestError } from '@supabase/supabase-js'

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

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
    if (error instanceof ApiError) return error.message
    if (isPostgrestError(error)) return error.message || fallback
    if (error instanceof Error) return error.message || fallback
    return fallback
}

export function toApiError(error: unknown, fallback?: string): ApiError {
    if (error instanceof ApiError) return error
    if (isPostgrestError(error)) {
        return new ApiError(error.message || fallback || 'Request failed.', error.code, error.details)
    }
    if (error instanceof Error) {
        return new ApiError(error.message || fallback || 'Request failed.')
    }
    return new ApiError(fallback || 'Request failed.')
}
