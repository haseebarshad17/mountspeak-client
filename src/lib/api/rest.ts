import { clientEnv } from '@/env/client'

import { ApiError } from './errors'

type RestMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

type RestRequestOptions = {
    method?: RestMethod
    body?: unknown
    accessToken?: string
    prefer?: string
    query?: Record<string, string>
}

/**
 * Low-level Supabase PostgREST helper for endpoints like /rest/v1/{table}.
 * Prefer service-layer wrappers; use this when you need raw REST access.
 */
export async function supabaseRestRequest<T>(
    table: string,
    options: RestRequestOptions = {},
): Promise<T> {
    const { method = 'GET', body, accessToken, prefer = 'return=representation', query } = options

    const url = new URL(`${clientEnv.supabaseUrl}/rest/v1/${table}`)
    if (query) {
        Object.entries(query).forEach(([key, value]) => url.searchParams.set(key, value))
    }

    const token = accessToken ?? clientEnv.supabaseKey

    const response = await fetch(url.toString(), {
        method,
        headers: {
            'Content-Type': 'application/json',
            apikey: clientEnv.supabaseKey,
            Authorization: `Bearer ${token}`,
            Prefer: prefer,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
        let message = `Request failed (${response.status})`
        try {
            const payload = (await response.json()) as { message?: string; hint?: string }
            message = payload.message ?? message
            if (payload.hint) message = `${message} — ${payload.hint}`
        } catch {
            // ignore parse errors
        }
        throw new ApiError(message, String(response.status))
    }

    if (response.status === 204 || prefer.includes('return=minimal')) {
        return undefined as T
    }

    return (await response.json()) as T
}

export async function supabaseRestPost<T>(table: string, body: unknown, accessToken?: string): Promise<T> {
    return supabaseRestRequest<T>(table, {
        method: 'POST',
        body,
        accessToken,
        prefer: 'return=representation',
    })
}
