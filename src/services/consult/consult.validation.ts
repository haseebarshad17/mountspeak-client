import { z } from 'zod'
import { MessageCode } from '@/lib/messages/codes'
import { INQUIRY_TYPE_OPTIONS, type InquiryType } from './consult.types'

const INQUIRY_TYPE_VALUES = INQUIRY_TYPE_OPTIONS.map((option) => option.value) as [
    InquiryType,
    ...InquiryType[],
]

export const consultUsSchema = z.object({
    name: z.string().trim().min(2, MessageCode.CONSULT_NAME_REQUIRED),
    email: z.string().trim().email(MessageCode.CONSULT_EMAIL_INVALID),
    phone: z
        .string()
        .trim()
        .min(1, MessageCode.CONSULT_PHONE_REQUIRED)
        .refine(
            (value) => /^[0-9+][0-9\s-]{6,17}$/.test(value),
            MessageCode.CONSULT_PHONE_INVALID
        ),
    inquiry_type: z.enum(INQUIRY_TYPE_VALUES),
    title: z.string().trim().min(3, MessageCode.CONSULT_TITLE_REQUIRED),
    description: z.string().trim().min(5, MessageCode.CONSULT_DESCRIPTION_REQUIRED),
})

export type ConsultUsFormValues = z.infer<typeof consultUsSchema>
