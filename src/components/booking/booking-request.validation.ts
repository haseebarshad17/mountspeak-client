import { z } from 'zod'
import { MessageCode } from '@/lib/messages/codes'
import { isValidE164Phone } from '@/lib/validation/phone'
import {
    BOOKING_REQUEST_CATEGORIES,
    type BookingRequestCategory,
} from '@/services/booking-requests/booking-requests.types'

export const MAX_BOOKING_REQUEST_SEATS = 50

export function getTodayDateInputValue(): string {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export const bookingRequestSchema = z
    .object({
        full_name: z
            .string()
            .trim()
            .min(2, MessageCode.BOOKING_REQUEST_FULL_NAME_REQUIRED),
        email: z.string().trim().email(MessageCode.BOOKING_REQUEST_EMAIL_INVALID),
        phone: z
            .string()
            .trim()
            .min(1, MessageCode.BOOKING_REQUEST_PHONE_REQUIRED)
            .refine((value) => isValidE164Phone(value), MessageCode.BOOKING_REQUEST_PHONE_FORMAT),
        travel_date: z
            .string()
            .min(1, MessageCode.BOOKING_REQUEST_TRAVEL_DATE_REQUIRED)
            .refine(
                (date) => date >= getTodayDateInputValue(),
                MessageCode.BOOKING_REQUEST_TRAVEL_DATE_PAST
            ),
        destination: z
            .string()
            .min(1, MessageCode.BOOKING_REQUEST_DESTINATION_REQUIRED),
        male_seat: z.coerce.number().int().min(0).max(MAX_BOOKING_REQUEST_SEATS),
        female_seat: z.coerce.number().int().min(0).max(MAX_BOOKING_REQUEST_SEATS),
        child_seat: z.coerce.number().int().min(0).max(MAX_BOOKING_REQUEST_SEATS),
        category: z
            .string()
            .trim()
            .superRefine((value, ctx) => {
                if (!value) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: MessageCode.BOOKING_REQUEST_CATEGORY_REQUIRED,
                    })
                    return
                }
                if (
                    !BOOKING_REQUEST_CATEGORIES.includes(
                        value as BookingRequestCategory
                    )
                ) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: MessageCode.BOOKING_REQUEST_CATEGORY_INVALID,
                    })
                }
            })
            .transform((value) => value as BookingRequestCategory),
        request_message: z.string().trim().optional(),
        past_history: z.string().trim().optional(),
    })
    .refine((data) => data.male_seat + data.female_seat >= 1, {
        message: MessageCode.BOOKING_REQUEST_SEAT_REQUIRED,
        path: ['male_seat'],
    })

export type BookingRequestFormValues = z.infer<typeof bookingRequestSchema>
