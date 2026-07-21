'use client'

import { useMutation } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase/supabase.client'

import { tourBookingsService } from './tour-bookings.service'
import type { SubmitPackageBookingDTO, SubmitTourBookingDTO } from './tour-bookings.types'

const tourBookings = tourBookingsService({ supabase })

export const useSubmitTourBooking = () => {
    return useMutation({
        mutationFn: (payload: SubmitTourBookingDTO) => tourBookings.submitTourBooking(payload),
    })
}

export const useSubmitPackageBooking = () => {
    return useMutation({
        mutationFn: (payload: SubmitPackageBookingDTO) => tourBookings.submitPackageBooking(payload),
    })
}

export const uploadBookingPaymentScreenshot = (
    agencyId: string,
    bookingId: string,
    file: File,
) => tourBookings.uploadPaymentScreenshot(agencyId, bookingId, file)

export const uploadBookingIdCard = (
    agencyId: string,
    bookingId: string,
    side: 'front' | 'back',
    file: File,
) => tourBookings.uploadIdCard(agencyId, bookingId, side, file)
