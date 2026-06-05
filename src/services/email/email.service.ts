import { serverEnv } from '@/env/server'

import { EMAIL_EDGE_FUNCTION_NAME } from './email.constants'
import type {
    SendTransactionalEmailPayload,
    SendTransactionalEmailResult,
} from './email.types'

export { buildBookingConfirmationEmailPayload } from './email.utils'

function getEmailEdgeFunctionUrl(): string {
    const base = serverEnv.supabaseUrl.replace(/\/$/, '')
    return `${base}/functions/v1/${EMAIL_EDGE_FUNCTION_NAME}`
}

export async function sendTransactionalEmail(
    payload: SendTransactionalEmailPayload,
): Promise<SendTransactionalEmailResult> {
    const secret = serverEnv.emailInternalSecret?.trim()

    if (!secret) {
        throw new Error('EMAIL_INTERNAL_SECRET is not configured.')
    }

    const response = await fetch(getEmailEdgeFunctionUrl(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-email-internal-secret': secret,
        },
        body: JSON.stringify(payload),
        cache: 'no-store',
    })

    let body: SendTransactionalEmailResult & { error?: string } = {
        success: false,
        message: 'Unable to send email.',
    }

    try {
        body = (await response.json()) as SendTransactionalEmailResult & { error?: string }
    } catch {
        body = {
            success: false,
            message: `Email service returned ${response.status}.`,
        }
    }

    if (!response.ok || body.success === false) {
        throw new Error(body.message ?? body.error ?? `Email service returned ${response.status}.`)
    }

    return body
}
