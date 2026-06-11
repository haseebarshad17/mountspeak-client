import { z } from 'zod'

import {
    CONSULTATION_INQUIRY_TYPES,
    CONSULTATION_TITLES,
} from './consultation-requests.types'

const phoneSchema = z
    .string()
    .trim()
    .min(1, 'Please enter your phone number.')
    .max(25, 'Phone number is too long.')
    .regex(
        /^\+?[0-9][0-9\s-]{6,24}$/,
        'Please enter a valid phone number (e.g. +92 300 1234567).',
    )

export const createConsultationRequestSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Please enter your full name.')
        .min(2, 'Full name must be at least 2 characters.'),
    email: z
        .string()
        .trim()
        .min(1, 'Please enter your email address.')
        .email('Please enter a valid email address.'),
    phone: phoneSchema,
    title: z.enum(CONSULTATION_TITLES, {
        message: 'Please select a subject.',
    }),
    description: z
        .string()
        .trim()
        .min(1, 'Please enter your message.')
        .min(10, 'Message must be at least 10 characters.'),
    inquiry_type: z.enum(CONSULTATION_INQUIRY_TYPES, {
        message: 'Please select an inquiry type.',
    }),
})

export type CreateConsultationRequestInput = z.infer<typeof createConsultationRequestSchema>

export function mapConsultationRequestFieldErrors(
    issues: z.ZodIssue[],
): Record<string, string> {
    const errors: Record<string, string> = {}

    for (const issue of issues) {
        const key = String(issue.path[0] ?? 'form')
        if (!errors[key]) {
            errors[key] = issue.message
        }
    }

    return errors
}
