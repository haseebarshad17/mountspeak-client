import type { SendTransactionalEmailPayload, SendTransactionalEmailResult } from './email.types'
import { buildBookingConfirmationEmailPayload } from './email.utils'

export async function requestTransactionalEmail(
    payload: SendTransactionalEmailPayload,
): Promise<SendTransactionalEmailResult> {
    const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })

    const body = (await response.json()) as SendTransactionalEmailResult & { error?: string }

    if (!response.ok) {
        throw new Error(body.error ?? body.message ?? 'Unable to send email.')
    }

    return body
}

export async function sendBookingConfirmationEmail(
    params: Parameters<typeof buildBookingConfirmationEmailPayload>[0],
): Promise<SendTransactionalEmailResult> {
    return requestTransactionalEmail(buildBookingConfirmationEmailPayload(params))
}
