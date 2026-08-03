import type { SupabaseClient } from '@supabase/supabase-js'
import {
    bookingEmailBrandingToTemplateVariables,
    loadBookingEmailBranding,
    type BookingEmailBranding,
} from '@/lib/email/email-branding'
import { invokeSendEmail } from '@/lib/email/send-email.server'
import { EMAIL_EVENT_TYPES } from '@/lib/email/types'
import { serverEnv } from '@/env/server'

function randomSignupPassword() {
    return `Tmp-${crypto.randomUUID()}!aA1`
}

export function assertOtpEmailConfig() {
    if (!serverEnv.SupabaseServiceRoleKey?.trim()) {
        throw new Error(
            'SUPABASE_SERVICE_ROLE_KEY is not configured on agency-site. Add it to .env.local (same value as dashboard) and restart the dev server.'
        )
    }
    if (!serverEnv.EmailInternalSecret?.trim()) {
        throw new Error('EMAIL_INTERNAL_SECRET is not configured on agency-site.')
    }
}

/**
 * Create a Supabase email OTP via admin generateLink.
 * Docs: generateLink does not send mail — we deliver via VERIFICATION_OTP.
 */
export async function generateEmailOtp(
    admin: SupabaseClient,
    email: string
): Promise<{ otp: string; verificationType: string }> {
    const magic = await admin.auth.admin.generateLink({
        type: 'magiclink',
        email,
    })

    const magicOtp = magic.data?.properties?.email_otp?.trim()
    if (!magic.error && magicOtp) {
        return {
            otp: magicOtp,
            verificationType: magic.data.properties.verification_type || 'magiclink',
        }
    }

    const signup = await admin.auth.admin.generateLink({
        type: 'signup',
        email,
        password: randomSignupPassword(),
    })

    const signupOtp = signup.data?.properties?.email_otp?.trim()
    if (signup.error || !signupOtp) {
        throw signup.error ?? magic.error ?? new Error('Could not generate verification code.')
    }

    return {
        otp: signupOtp,
        verificationType: signup.data.properties.verification_type || 'signup',
    }
}

export async function sendVerificationOtpEmail(input: {
    email: string
    otp: string
    agencyId: string
    branding: BookingEmailBranding
}) {
    const email = input.email.trim().toLowerCase()
    const brandingVars = bookingEmailBrandingToTemplateVariables(input.branding)

    await invokeSendEmail({
        event_type: EMAIL_EVENT_TYPES.VERIFICATION_OTP,
        to_email: email,
        to_name: email,
        variables: {
            ...brandingVars,
            email_type: EMAIL_EVENT_TYPES.VERIFICATION_OTP,
            email,
            customer_email: email,
            otp: input.otp,
            verification_code: input.otp,
            token: input.otp,
            agency_id: input.agencyId,
        },
        metadata: {
            agency_id: input.agencyId,
            email_type: EMAIL_EVENT_TYPES.VERIFICATION_OTP,
        },
    })
}

export { loadBookingEmailBranding }
