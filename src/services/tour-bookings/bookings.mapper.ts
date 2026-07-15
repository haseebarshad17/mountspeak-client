import type { SubmitTourBookingDTO } from './tour-bookings.types'

export function buildSubmitTourBookingPayload(params: {
    bookingId: string
    tourId: string
    slotId?: string | null
    name: string
    email: string
    phone: string
    emergencyPhone: string
    cnic: string
    maleSeats: number
    femaleSeats: number
    kidsSeats: number
    notes?: string
    screenshotPath: string
    idCardFrontPath: string
    idCardBackPath: string
    provider?: 'EASYPAISA' | 'JAZZCASH' | null
    transactionReference?: string | null
}): SubmitTourBookingDTO {
    return {
        p_booking_id: params.bookingId,
        p_tour_id: params.tourId,
        p_name: params.name.trim(),
        p_email: params.email.trim().toLowerCase(),
        p_phone: params.phone.trim(),
        p_emergency_phone: params.emergencyPhone.trim(),
        p_cnic: params.cnic.trim(),
        p_male_seat: params.maleSeats,
        p_female_seat: params.femaleSeats,
        p_kids_seats: params.kidsSeats,
        p_notes: params.notes?.trim() || null,
        p_screenshot_path: params.screenshotPath,
        p_id_card_front_path: params.idCardFrontPath,
        p_id_card_back_path: params.idCardBackPath,
        ...(params.slotId ? { p_slot_id: params.slotId } : {}),
        ...(params.provider ? { p_provider: params.provider } : {}),
        ...(params.transactionReference?.trim()
            ? { p_transaction_reference: params.transactionReference.trim() }
            : {}),
    }
}
