export const EMAIL_EVENT_TYPES = {
    VERIFICATION_OTP: 'VERIFICATION_OTP',
} as const

export type EmailEventType = (typeof EMAIL_EVENT_TYPES)[keyof typeof EMAIL_EVENT_TYPES]

export type SendEmailPayload = {
    event_type: EmailEventType | string
    to_email: string
    to_name?: string | null
    variables?: Record<string, unknown>
    metadata?: Record<string, unknown>
}
