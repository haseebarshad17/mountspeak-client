import { useMutation } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase/supabase.client'

import { bookingRequestsService } from './booking-requests.service'
import type { CreateBookingRequestDTO } from './booking-requests.types'

const bookingRequests = bookingRequestsService({ supabase })

export const useCreateBookingRequest = () => {
    return useMutation({
        mutationFn: (payload: CreateBookingRequestDTO) =>
            bookingRequests.createBookingRequest(payload),
    })
}
