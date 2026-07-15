import { z } from 'zod'

import { MessageCode } from '@/lib/messages/codes'

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
    .min(7, MessageCode.BOOKING_PHONE_INVALID)
    .max(20, MessageCode.BOOKING_PHONE_TOO_LONG)
    .regex(/^\+?[0-9\s-]{7,20}$/, MessageCode.BOOKING_PHONE_FORMAT)

export const bookingDetailsSchema = z
    .object({
        firstName: z
            .string()
            .trim()
            .min(2, MessageCode.BOOKING_FIRST_NAME_MIN)
            .max(40, MessageCode.BOOKING_FIRST_NAME_MAX),
        lastName: z
            .string()
            .trim()
            .min(2, MessageCode.BOOKING_LAST_NAME_MIN)
            .max(40, MessageCode.BOOKING_LAST_NAME_MAX),
        phone: phoneSchema,
        emergencyPhone: phoneSchema,
        cnic: z
            .string()
            .trim()
            .transform(formatCnicInput)
            .refine((value) => CNIC_REGEX.test(value), {
                message: MessageCode.BOOKING_CNIC_INVALID,
            }),
        tourId: z.string().uuid(MessageCode.BOOKING_TOUR_REQUIRED),
        slotId: z.string().optional(),
        maleSeats: z.coerce.number().int().min(0),
        femaleSeats: z.coerce.number().int().min(0),
        kidsSeats: z.coerce.number().int().min(0),
        note: z.string().trim().max(500, MessageCode.BOOKING_NOTE_MAX).optional(),
    })
    .refine((data) => data.maleSeats + data.femaleSeats + data.kidsSeats >= 1, {
        message: MessageCode.BOOKING_SEAT_REQUIRED,
        path: ['maleSeats'],
    })

export const bookingPaymentSchema = z.object({
    paymentScreenshot: z
        .custom<File>((value) => value instanceof File, MessageCode.BOOKING_PAYMENT_SCREENSHOT_REQUIRED)
        .refine((file) => file.size <= 10 * 1024 * 1024, MessageCode.BOOKING_PAYMENT_SCREENSHOT_SIZE),
})

export const bookingIdCardSchema = z.object({
    idCardFront: z
        .custom<File>((value) => value instanceof File, MessageCode.BOOKING_ID_CARD_FRONT_REQUIRED)
        .refine((file) => file.size <= 10 * 1024 * 1024, MessageCode.BOOKING_ID_CARD_SIZE),
    idCardBack: z
        .custom<File>((value) => value instanceof File, MessageCode.BOOKING_ID_CARD_BACK_REQUIRED)
        .refine((file) => file.size <= 10 * 1024 * 1024, MessageCode.BOOKING_ID_CARD_SIZE),
})
