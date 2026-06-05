import { EMAIL_EVENT_TYPES } from './email.constants'
import type { SendTransactionalEmailPayload } from './email.types'

export function buildBookingConfirmationEmailPayload(params: {
    toEmail: string
    toName: string
    bookingId: string
    tourTitle: string
    tourSlug?: string
    maleSeats: number
    femaleSeats: number
    kidsSeats: number
    amountTotal: number
    phone: string
    emergencyPhone: string
    cnic: string
    notes?: string
    siteUrl?: string
}): SendTransactionalEmailPayload {
    const totalSeats = params.maleSeats + params.femaleSeats + params.kidsSeats
    const siteUrl = params.siteUrl?.replace(/\/$/, '') ?? ''

    return {
        event_type: EMAIL_EVENT_TYPES.bookingConfirmation,
        to_email: params.toEmail.trim().toLowerCase(),
        to_name: params.toName.trim(),
        variables: {
            customer_name: params.toName.trim(),
            customer_email: params.toEmail.trim().toLowerCase(),
            booking_id: params.bookingId,
            tour_title: params.tourTitle,
            tour_slug: params.tourSlug ?? '',
            male_seats: params.maleSeats,
            female_seats: params.femaleSeats,
            kids_seats: params.kidsSeats,
            total_seats: totalSeats,
            amount_total: `PKR ${params.amountTotal.toLocaleString('en-PK')}`,
            phone: params.phone,
            emergency_phone: params.emergencyPhone,
            cnic: params.cnic,
            notes: params.notes?.trim() || '—',
            submitted_at: new Date().toISOString(),
            site_url: siteUrl,
            bookings_url: siteUrl ? `${siteUrl}/bookings` : '/bookings',
        },
        metadata: {
            booking_id: params.bookingId,
            tour_slug: params.tourSlug ?? null,
        },
    }
}
