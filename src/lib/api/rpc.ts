import type { SupabaseClient } from '@supabase/supabase-js'

import { ApiError, toApiError } from '@/lib/api/errors'

export async function callSupabaseRpc<T>(
    supabase: SupabaseClient,
    functionName: string,
    args: Record<string, unknown>,
    fallbackMessage = 'Request failed.',
): Promise<T> {
    const { data, error } = await supabase.rpc(functionName, args)

    if (error) {
        throw toApiError(error, fallbackMessage)
    }

    return data as T
}

export function assertRpcSuccess<T extends { success?: boolean; message?: string }>(
    payload: T,
    fallbackMessage = 'Request failed.',
): T {
    if (payload?.success === false) {
        throw new ApiError(payload.message ?? fallbackMessage)
    }

    return payload
}
