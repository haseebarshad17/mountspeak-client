import { z } from 'zod'

/** Formats CNIC as 12345-1234567-1 while typing (max 13 digits). */
export function formatCnicInput(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 13)

    if (digits.length <= 5) return digits
    if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`

    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`
}

const CNIC_REGEX = /^\d{5}-\d{7}-\d$/

const phoneSchema = z
    .string()
    .trim()
    .min(7, 'Please enter a valid phone number.')
    .max(20, 'Phone number is too long.')
    .regex(/^\+?[0-9\s-]{7,20}$/, 'Enter a valid phone number (e.g. +923001234567).')

export const bookingDetailsSchema = z
    .object({
        firstName: z
            .string()
            .trim()
            .min(2, 'First name must be at least 2 characters.')
            .max(40, 'First name is too long.'),
        lastName: z
            .string()
            .trim()
            .min(2, 'Last name must be at least 2 characters.')
            .max(40, 'Last name is too long.'),
        phone: phoneSchema,
        emergencyPhone: phoneSchema,
        cnic: z
            .string()
            .trim()
            .transform(formatCnicInput)
            .refine((value) => CNIC_REGEX.test(value), {
                message: 'CNIC must be 13 digits (e.g. 12345-1234567-1).',
            }),
        tourId: z.string().uuid('Please select a tour plan.'),
        maleSeats: z.coerce.number().int().min(0),
        femaleSeats: z.coerce.number().int().min(0),
        kidsSeats: z.coerce.number().int().min(0),
        note: z.string().trim().max(500, 'Note cannot exceed 500 characters.').optional(),
    })
    .refine((data) => data.maleSeats + data.femaleSeats + data.kidsSeats >= 1, {
        message: 'Select at least one seat or one child.',
        path: ['maleSeats'],
    })

export const bookingPaymentSchema = z.object({
    paymentScreenshot: z
        .custom<File>((value) => value instanceof File, 'Payment screenshot is required.')
        .refine((file) => file.size <= 10 * 1024 * 1024, 'Screenshot must be 10MB or smaller.'),
})
