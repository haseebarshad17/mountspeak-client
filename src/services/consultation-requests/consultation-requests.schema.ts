import { z } from 'zod'

import {
    CONSULTATION_INQUIRY_TYPES,
    CONSULTATION_TITLES,
} from './consultation-requests.types'

export const createConsultationRequestSchema = z.object({
    name: z.string().trim().min(2, 'Name is required.'),
    email: z.string().trim().email('Please enter a valid email.'),
    phone: z
        .string()
        .trim()
        .min(7, 'Phone number is required.')
        .regex(/^\+?[0-9\s-]{7,20}$/, 'Enter a valid phone number.'),
    title: z.enum(CONSULTATION_TITLES),
    description: z.string().trim().min(10, 'Please provide at least 10 characters.'),
    inquiry_type: z.enum(CONSULTATION_INQUIRY_TYPES),
})

export type CreateConsultationRequestInput = z.infer<typeof createConsultationRequestSchema>
