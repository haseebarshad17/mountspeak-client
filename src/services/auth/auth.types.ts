// Google OAuth DTO
export type GoogleLoginDTO = {
    redirectTo: string
    agency_id?: string
}

// Magic link DTO (agency customer sites)
export type MagicLinkDTO = {
    email: string
    emailRedirectTo: string
    agency_id?: string
    agency_site_url?: string
}

export type BookingEmailOtpDTO = MagicLinkDTO

export type VerifyBookingEmailOtpDTO = {
    email: string
    token: string
    agency_id?: string
}

