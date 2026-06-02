import type { SupabaseClient } from '@supabase/supabase-js'

import { supabaseRestPost } from '@/lib/api/rest'
import { toApiError } from '@/lib/api/errors'

import type { BookingRequestRecord, CreateBookingRequestDTO } from './booking-requests.types'

const BOOKING_REQUESTS_TABLE = 'booking_requests'

type BookingRequestsServiceProps = {
    supabase: SupabaseClient
}

export const bookingRequestsService = ({ supabase }: BookingRequestsServiceProps) => {
    return {
        /**
         * POST /rest/v1/booking_requests
         */
        createBookingRequest: async (
            payload: CreateBookingRequestDTO,
        ): Promise<BookingRequestRecord> => {
            const { data, error } = await supabase
                .from(BOOKING_REQUESTS_TABLE)
                .insert(payload)
                .select()
                .maybeSingle()

            if (error) throw toApiError(error, 'Unable to submit booking request.')

            // Insert can succeed even when SELECT is blocked by RLS (data comes back null).
            if (data) return data as BookingRequestRecord

            return {
                ...payload,
                id: '',
            }
        },

        /**
         * Same endpoint via raw REST helper (for future server-side or custom auth flows).
         */
        createBookingRequestViaRest: async (
            payload: CreateBookingRequestDTO,
            accessToken?: string,
        ): Promise<BookingRequestRecord> => {
            try {
                const rows = await supabaseRestPost<BookingRequestRecord[]>(
                    BOOKING_REQUESTS_TABLE,
                    payload,
                    accessToken,
                )
                const record = Array.isArray(rows) ? rows[0] : rows
                if (!record) {
                    throw new Error('Booking request was created but no record was returned.')
                }
                return record
            } catch (error) {
                throw toApiError(error, 'Unable to submit booking request.')
            }
        },
    }
}
