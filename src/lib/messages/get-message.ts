import { MessageCode, type MessageCodeValue } from './codes'

const LABELS: Partial<Record<MessageCodeValue, string>> = {
    [MessageCode.API_GENERIC]: 'Something went wrong. Please try again.',
    [MessageCode.API_BOOKING_SUBMIT_FAILED]: 'Could not submit booking. Please try again.',
    [MessageCode.API_PAYMENT_SCREENSHOT_UPLOAD_FAILED]:
        'Could not upload payment screenshot.',
    [MessageCode.API_ID_CARD_UPLOAD_FAILED]: 'Could not upload ID card image.',
    [MessageCode.API_BOOKING_REQUEST_SUBMIT_FAILED]:
        'Could not submit booking request. Please try again.',
    [MessageCode.API_NEWSLETTER_SUBSCRIBE_FAILED]:
        'Could not subscribe. Please try again.',
    [MessageCode.API_CONSULT_SUBMIT_FAILED]:
        'Could not send your message. Please try again.',
    [MessageCode.CONSULT_SUBMIT_SUCCESS]: 'Message sent — we’ll be in touch shortly.',
    [MessageCode.CONSULT_NAME_REQUIRED]: 'Enter your full name.',
    [MessageCode.CONSULT_EMAIL_INVALID]: 'Enter a valid email address.',
    [MessageCode.CONSULT_PHONE_REQUIRED]: 'Phone number is required.',
    [MessageCode.CONSULT_PHONE_INVALID]: 'Enter a valid phone number.',
    [MessageCode.CONSULT_TITLE_REQUIRED]: 'Add a short subject for your message.',
    [MessageCode.CONSULT_DESCRIPTION_REQUIRED]: 'Add a short message so we know how to help.',
    [MessageCode.CONSULT_MISSING_AGENCY]: 'Agency context is missing.',
    [MessageCode.VALIDATION_FIX_HIGHLIGHTED_FIELDS]: 'Please fix the highlighted fields.',
    [MessageCode.BOOKING_EMAIL_VERIFY_REQUIRED]:
        'Verify your email with the OTP code before submitting.',
    [MessageCode.BOOKING_OTP_SENT]: 'Verification code sent to your email.',
    [MessageCode.BOOKING_OTP_VERIFIED]: 'Email verified. You are signed in.',
    [MessageCode.BOOKING_OTP_INVALID]: 'Enter the 6-digit code from your email.',
    [MessageCode.BOOKING_OTP_SEND_FAILED]: 'Could not send verification code. Please try again.',
    [MessageCode.BOOKING_OTP_VERIFY_FAILED]: 'Could not verify code. Please try again.',
    [MessageCode.BOOKING_FIRST_NAME_MIN]: 'Enter a valid first name.',
    [MessageCode.BOOKING_LAST_NAME_MIN]: 'Enter a valid last name.',
    [MessageCode.BOOKING_PHONE_INVALID]: 'Enter a valid phone number.',
    [MessageCode.BOOKING_CNIC_INVALID]: 'CNIC must be like 12345-1234567-1.',
    [MessageCode.BOOKING_TOUR_REQUIRED]: 'Select a tour to continue.',
    [MessageCode.BOOKING_NOTE_MAX]: 'Note is too long.',
    [MessageCode.BOOKING_SEAT_REQUIRED]: 'Add at least one adult seat.',
    [MessageCode.BOOKING_SLOT_REQUIRED]: 'Select a departure slot to continue.',
    [MessageCode.BOOKING_PAYMENT_SCREENSHOT_REQUIRED]: 'Upload a payment screenshot.',
    [MessageCode.BOOKING_PAYMENT_SCREENSHOT_SIZE]: 'Screenshot must be under 10MB.',
    [MessageCode.BOOKING_ID_CARD_FRONT_REQUIRED]: 'Upload the front of your ID card.',
    [MessageCode.BOOKING_ID_CARD_BACK_REQUIRED]: 'Upload the back of your ID card.',
    [MessageCode.BOOKING_ID_CARD_SIZE]: 'ID card image must be under 10MB.',
    [MessageCode.BOOKING_CLOSED]: 'Bookings for this departure are closed.',
    [MessageCode.BOOKING_SOLD_OUT]: 'This departure is sold out.',
    [MessageCode.BOOKING_MISSING_AGENCY]: 'Agency context is missing.',
    [MessageCode.BOOKING_REQUEST_FULL_NAME_REQUIRED]: 'Full name is required.',
    [MessageCode.BOOKING_REQUEST_EMAIL_INVALID]: 'Enter a valid email.',
    [MessageCode.BOOKING_REQUEST_PHONE_REQUIRED]: 'Phone number is required.',
    [MessageCode.BOOKING_REQUEST_PHONE_FORMAT]:
        'Enter a valid phone number for the selected country.',
    [MessageCode.BOOKING_REQUEST_TRAVEL_DATE_REQUIRED]: 'Travel date is required.',
    [MessageCode.BOOKING_REQUEST_TRAVEL_DATE_PAST]: 'Travel date cannot be in the past.',
    [MessageCode.BOOKING_REQUEST_DESTINATION_REQUIRED]: 'Destination is required.',
    [MessageCode.BOOKING_REQUEST_CATEGORY_REQUIRED]: 'Category is required.',
    [MessageCode.BOOKING_REQUEST_CATEGORY_INVALID]: 'Select a valid category.',
    [MessageCode.BOOKING_REQUEST_SEAT_REQUIRED]: 'Add at least one adult traveler.',
}

export function getMessage(code: MessageCodeValue | string): string {
    return LABELS[code as MessageCodeValue] || String(code).replace(/_/g, ' ').toLowerCase()
}

export function mapZodIssuesToFieldErrors(
    issues: Array<{ path: PropertyKey[]; message: string }>
): Record<string, string> {
    const errors: Record<string, string> = {}
    for (const issue of issues) {
        const key = String(issue.path[0] ?? 'form')
        if (!errors[key]) errors[key] = getMessage(issue.message)
    }
    return errors
}
