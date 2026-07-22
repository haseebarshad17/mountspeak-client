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
    p_slot_id?: string | null
    p_pickup_point_id?: string | null
    p_id_card_front_path: string
    p_id_card_back_path: string
}

/** Payload for public.submit_package_booking RPC. */
export type SubmitPackageBookingDTO = {
    p_booking_id: string
    p_listing_kind: 'umrah' | 'international'
    p_package_id: string
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
    p_id_card_front_path: string
    p_id_card_back_path: string
}

export type SubmitTourBookingRpcResponse = {
    success: boolean
    message?: string
    booking_id: string
    payment_id: string
    payment_status: string
    booking_status: string
    slot_id?: string | null
    amount_total?: number
    advance_amount_due?: number
    balance_due?: number
}

export type SubmitPackageBookingRpcResponse = SubmitTourBookingRpcResponse & {
    listing_kind?: 'umrah' | 'international'
}

export type TourBookingRecord = {
    id: string
    payment_id: string
    created_at?: string
}
