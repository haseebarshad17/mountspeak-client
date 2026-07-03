import type { SupabaseClient } from '@supabase/supabase-js'

import { assertRpcSuccess, callSupabaseRpc } from '@/lib/api/rpc'
import { toApiError } from '@/lib/api/errors'
import { MessageCode } from '@/lib/messages/codes'

import { SUBMIT_TOUR_BOOKING_RPC } from './tour-bookings.constants'
import type {
    SubmitTourBookingDTO,
    SubmitTourBookingRpcResponse,
    TourBookingRecord,
} from './tour-bookings.types'

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

export function buildBookingPaymentScreenshotPath(
    agencyId: string,
    bookingId: string,
    file: File,
): string {
    const ext = paymentScreenshotExtension(file)
    return `${agencyId}/${bookingId}/payment.${ext}`
}

export const tourBookingsService = ({ supabase }: TourBookingsServiceProps) => {
    return {
        submitTourBooking: async (payload: SubmitTourBookingDTO): Promise<TourBookingRecord> => {
            const data = await callSupabaseRpc<SubmitTourBookingRpcResponse>(
                supabase,
                SUBMIT_TOUR_BOOKING_RPC,
                payload,
                MessageCode.API_BOOKING_SUBMIT_FAILED,
            )

            const result = assertRpcSuccess(data, MessageCode.API_BOOKING_SUBMIT_FAILED)

            return {
                id: result.booking_id,
                payment_id: result.payment_id,
            }
        },

        uploadPaymentScreenshot: async (
            agencyId: string,
            bookingId: string,
            file: File,
        ): Promise<string> => {
            const path = buildBookingPaymentScreenshotPath(agencyId, bookingId, file)

            const { error: uploadError } = await supabase.storage
                .from(BOOKING_PAYMENT_SCREENSHOTS_BUCKET)
                .upload(path, file, {
                    contentType: file.type || `image/${paymentScreenshotExtension(file)}`,
                    upsert: true,
                })

            if (uploadError) {
                throw toApiError(uploadError, MessageCode.API_PAYMENT_SCREENSHOT_UPLOAD_FAILED)
            }

            return path
        },
    }
}
