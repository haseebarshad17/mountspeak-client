import { useMutation } from '@tanstack/react-query'

import { getApiErrorMessage } from '@/lib/api/errors'
import { MessageCode } from '@/lib/messages/codes'
import { supabase } from '@/lib/supabase/supabase.client'

import { bookingRequestsService } from './booking-requests.service'
import type { CreateBookingRequestDTO } from './booking-requests.types'

const bookingRequests = bookingRequestsService({ supabase })

export const useCreateBookingRequest = () => {
    return useMutation({
        mutationFn: (payload: CreateBookingRequestDTO) =>
            bookingRequests.createBookingRequest(payload),
        meta: {
            getErrorMessage: (error: unknown) =>
                getApiErrorMessage(error, MessageCode.API_BOOKING_REQUEST_SUBMIT_FAILED),
        },
    })
}
