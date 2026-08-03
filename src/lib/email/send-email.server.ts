import { clientEnv } from '@/env/client'
import { serverEnv } from '@/env/server'
import type { SendEmailPayload } from '@/lib/email/types'

type SendEmailResponse = {
    success?: boolean
    message?: string
    error?: string
}

/**
 * Calls Supabase `send-email` the same way the pre-restructure agency-site did:
 * only `x-email-internal-secret` (+ apikey when available).
 */
export async function invokeSendEmail(payload: SendEmailPayload): Promise<SendEmailResponse> {
    if (!serverEnv.EmailInternalSecret) {
        throw new Error('EMAIL_INTERNAL_SECRET is not configured.')
    }

    const apiKey = serverEnv.SupabaseServiceRoleKey || clientEnv.SupabaseKey
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-email-internal-secret': serverEnv.EmailInternalSecret,
    }

    if (apiKey) {
        headers.apikey = apiKey
        headers.Authorization = `Bearer ${apiKey}`
    }

    const response = await fetch(`${clientEnv.SupabaseURL}/functions/v1/send-email`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        cache: 'no-store',
    })

    const data = (await response.json().catch(() => ({}))) as SendEmailResponse

    if (!response.ok || data.success === false) {
        throw new Error(
            data.message ?? data.error ?? `send-email failed with status ${response.status}`
        )
    }

    return data
}
