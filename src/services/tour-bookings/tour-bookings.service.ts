import type { SupabaseClient } from '@supabase/supabase-js'

import { toApiError } from '@/lib/api/errors'
import { MessageCode } from '@/lib/messages/codes'

import { BOOKINGS_RETURN_COLUMNS, toBookingsInsertRow } from './bookings.mapper'

import type { CreateTourBookingDTO, TourBookingRecord } from './tour-bookings.types'

const BOOKINGS_TABLE = 'bookings'

/** Supabase storage bucket for payment screenshots. */
export const BOOKING_PAYMENT_SCREENSHOTS_BUCKET = 'booking-payment-screenshots'

type TourBookingsServiceProps = {
    supabase: SupabaseClient
}

function paymentScreenshotExtension(file: File): string {
    const fromName = file.name.split('.').pop()?.toLowerCase()
    if (fromName === 'png' || fromName === 'jpg' || fromName === 'jpeg' || fromName === 'webp') {
        return fromName === 'jpeg' ? 'jpg' : fromName
    }

    if (file.type === 'image/png') return 'png'
    if (file.type === 'image/webp') return 'webp'

    return 'jpg'
}

export const tourBookingsService = ({ supabase }: TourBookingsServiceProps) => {
    return {
        createTourBooking: async (payload: CreateTourBookingDTO): Promise<TourBookingRecord> => {
            const { data, error } = await supabase
                .from(BOOKINGS_TABLE)
                .insert(toBookingsInsertRow(payload))
                .select(BOOKINGS_RETURN_COLUMNS)
                .maybeSingle()

            if (error) throw toApiError(error, MessageCode.API_BOOKING_SUBMIT_FAILED)

            if (data) return { ...payload, ...data } as TourBookingRecord

            return {
                ...payload,
                id: '',
            }
        },

        updateBookingPaymentScreenshot: async (
            bookingId: string,
            paymentScreenshotUrl: string,
        ): Promise<void> => {
            const { error } = await supabase
                .from(BOOKINGS_TABLE)
                .update({ booking_payment_screenshot: paymentScreenshotUrl })
                .eq('id', bookingId)

            if (error) throw toApiError(error, MessageCode.API_PAYMENT_SCREENSHOT_SAVE_FAILED)
        },

        uploadPaymentScreenshot: async (
            agencyId: string,
            bookingId: string,
            file: File,
        ): Promise<string> => {
            const ext = paymentScreenshotExtension(file)
            const path = `${agencyId}/${bookingId}/payment.${ext}`

            const { error: uploadError } = await supabase.storage
                .from(BOOKING_PAYMENT_SCREENSHOTS_BUCKET)
                .upload(path, file, {
                    contentType: file.type || `image/${ext}`,
                    upsert: true,
                })

            if (uploadError) {
                throw toApiError(uploadError, MessageCode.API_PAYMENT_SCREENSHOT_UPLOAD_FAILED)
            }

            const { data } = supabase.storage
                .from(BOOKING_PAYMENT_SCREENSHOTS_BUCKET)
                .getPublicUrl(path)

            return data.publicUrl
        },
    }
}
