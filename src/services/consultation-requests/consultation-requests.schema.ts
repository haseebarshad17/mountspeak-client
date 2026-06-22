import { z } from 'zod'

import { MessageCode } from '@/lib/messages/codes'
import { mapZodIssuesToFieldErrors } from '@/lib/messages/get-message'

import {
    CONSULTATION_INQUIRY_TYPES,
    CONSULTATION_TITLES,
} from './consultation-requests.types'

const phoneSchema = z
    .string()
    .trim()
    .min(1, MessageCode.CONTACT_PHONE_REQUIRED)
    .max(25, MessageCode.CONTACT_PHONE_TOO_LONG)
    .regex(
        /^\+?[0-9][0-9\s-]{6,24}$/,
        MessageCode.CONTACT_PHONE_FORMAT,
    )

export const createConsultationRequestSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, MessageCode.CONTACT_NAME_REQUIRED)
        .min(2, MessageCode.CONTACT_NAME_MIN),
    email: z
        .string()
        .trim()
        .min(1, MessageCode.CONTACT_EMAIL_REQUIRED)
        .email(MessageCode.CONTACT_EMAIL_INVALID),
    phone: phoneSchema,
    title: z.enum(CONSULTATION_TITLES, {
        message: MessageCode.CONTACT_SUBJECT_REQUIRED,
    }),
    description: z
        .string()
        .trim()
        .min(1, MessageCode.CONTACT_MESSAGE_REQUIRED)
        .min(10, MessageCode.CONTACT_MESSAGE_MIN),
    inquiry_type: z.enum(CONSULTATION_INQUIRY_TYPES, {
        message: MessageCode.CONTACT_INQUIRY_TYPE_REQUIRED,
    }),
    agency_id: z.string().uuid().optional(),
})

export type CreateConsultationRequestInput = z.infer<typeof createConsultationRequestSchema>

export function mapConsultationRequestFieldErrors(
    issues: z.ZodIssue[],
): Record<string, string> {
    return mapZodIssuesToFieldErrors(issues)
}
