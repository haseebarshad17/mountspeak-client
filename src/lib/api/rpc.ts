import type { SupabaseClient } from '@supabase/supabase-js'

import { ApiError, getApiErrorMessage, toApiError } from '@/lib/api/errors'
import { MessageCode, type MessageCodeValue } from '@/lib/messages/codes'

export async function callSupabaseRpc<T>(
    supabase: SupabaseClient,
    functionName: string,
    args: Record<string, unknown>,
    code: MessageCodeValue = MessageCode.API_GENERIC,
): Promise<T> {
    const { data, error } = await supabase.rpc(functionName, args)

    if (error) {
        throw toApiError(error, code)
    }

    return data as T
}

export function assertRpcSuccess<T extends { success?: boolean }>(
    payload: T,
    code: MessageCodeValue = MessageCode.API_GENERIC,
): T {
    if (payload?.success === false) {
        throw new ApiError(getApiErrorMessage(null, code), code)
    }

    return payload
}
