import type { SupabaseClient } from '@supabase/supabase-js'
import { toApiError } from '@/lib/api/errors'
import { MessageCode } from '@/lib/messages/codes'
import type {
    BookingRequestRecord,
    CreateBookingRequestDTO,
} from './booking-requests.types'

const BOOKING_REQUESTS_TABLE = 'booking_requests'

export function bookingRequestsService({ supabase }: { supabase: SupabaseClient }) {
    return {
        createBookingRequest: async (
            payload: CreateBookingRequestDTO
        ): Promise<BookingRequestRecord> => {
            const { data, error } = await supabase
                .from(BOOKING_REQUESTS_TABLE)
                .insert(payload)
                .select()
                .maybeSingle()

            if (error) {
                throw toApiError(error, MessageCode.API_BOOKING_REQUEST_SUBMIT_FAILED)
            }

            if (data) return data as BookingRequestRecord
            return { ...payload, id: '' }
        },
    }
}
