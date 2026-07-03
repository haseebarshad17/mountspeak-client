/** Payload for public.submit_tour_booking RPC. */
export type SubmitTourBookingDTO = {
    p_booking_id: string
    p_tour_id: string
    p_name: string
    p_email: string
    p_phone: string
    p_emergency_phone: string
    p_cnic: string
    p_male_seat: number
    p_female_seat: number
    p_kids_seats: number
    p_notes?: string | null
    p_screenshot_path: string
    p_provider?: 'EASYPAISA' | 'JAZZCASH' | null
    p_transaction_reference?: string | null
}

export type SubmitTourBookingRpcResponse = {
    success: boolean
    message?: string
    booking_id: string
    payment_id: string
    payment_status: string
    booking_status: string
}

export type TourBookingRecord = {
    id: string
    payment_id: string
    created_at?: string
}
