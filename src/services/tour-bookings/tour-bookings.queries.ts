import { useMutation } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase/supabase.client'

import { tourBookingsService } from './tour-bookings.service'
import type { CreateTourBookingDTO } from './tour-bookings.types'

const tourBookings = tourBookingsService({ supabase })

export const useCreateTourBooking = () => {
    return useMutation({
        mutationFn: (payload: CreateTourBookingDTO) => tourBookings.createTourBooking(payload),
    })
}

export const uploadBookingPaymentScreenshot = (
    agencyId: string,
    bookingId: string,
    file: File,
) => tourBookings.uploadPaymentScreenshot(agencyId, bookingId, file)

export const updateBookingPaymentScreenshot = (bookingId: string, paymentScreenshotUrl: string) =>
    tourBookings.updateBookingPaymentScreenshot(bookingId, paymentScreenshotUrl)
