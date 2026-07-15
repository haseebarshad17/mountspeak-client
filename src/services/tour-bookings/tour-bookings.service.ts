import type { SupabaseClient } from '@supabase/supabase-js'

import { assertRpcSuccess, callSupabaseRpc } from '@/lib/api/rpc'
import { toApiError } from '@/lib/api/errors'
import { MessageCode, type MessageCodeValue } from '@/lib/messages/codes'

import { SUBMIT_TOUR_BOOKING_RPC } from './tour-bookings.constants'
import type {
    SubmitTourBookingDTO,
    SubmitTourBookingRpcResponse,
    TourBookingRecord,
} from './tour-bookings.types'

/** Supabase storage bucket for payment screenshots and ID cards. */
export const BOOKING_PAYMENT_SCREENSHOTS_BUCKET = 'booking-payment-screenshots'

type TourBookingsServiceProps = {
    supabase: SupabaseClient
}

function mediaExtension(file: File): string {
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
    const ext = mediaExtension(file)
    return `${agencyId}/${bookingId}/payment.${ext}`
}

export function buildBookingIdCardPath(
    agencyId: string,
    bookingId: string,
    side: 'front' | 'back',
    file: File,
): string {
    const ext = mediaExtension(file)
    return `${agencyId}/${bookingId}/id-${side}.${ext}`
}

async function uploadBookingMedia(
    supabase: SupabaseClient,
    path: string,
    file: File,
    failureCode: MessageCodeValue,
): Promise<string> {
    const { error: uploadError } = await supabase.storage
        .from(BOOKING_PAYMENT_SCREENSHOTS_BUCKET)
        .upload(path, file, {
            contentType: file.type || `image/${mediaExtension(file)}`,
            upsert: true,
        })

    if (uploadError) {
        throw toApiError(uploadError, failureCode)
    }

    return path
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
            return uploadBookingMedia(supabase, path, file, MessageCode.API_PAYMENT_SCREENSHOT_UPLOAD_FAILED)
        },

        uploadIdCard: async (
            agencyId: string,
            bookingId: string,
            side: 'front' | 'back',
            file: File,
        ): Promise<string> => {
            const path = buildBookingIdCardPath(agencyId, bookingId, side, file)
            return uploadBookingMedia(supabase, path, file, MessageCode.API_ID_CARD_UPLOAD_FAILED)
        },
    }
}
