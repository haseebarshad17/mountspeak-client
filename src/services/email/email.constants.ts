/** Supabase Edge Function that calls `processSendEmailRequest`. */
export const EMAIL_EDGE_FUNCTION_NAME = 'send-email'

export const EMAIL_EVENT_TYPES = {
    bookingConfirmation: 'BOOKING_CONFIRMATION',
} as const

export type EmailEventType = (typeof EMAIL_EVENT_TYPES)[keyof typeof EMAIL_EVENT_TYPES]
