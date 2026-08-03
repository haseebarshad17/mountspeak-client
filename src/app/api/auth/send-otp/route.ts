import { NextResponse } from 'next/server'
import { z } from 'zod'
import {
    assertOtpEmailConfig,
    generateEmailOtp,
    loadBookingEmailBranding,
    sendVerificationOtpEmail,
} from '@/lib/email/verification-otp'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { isValidAgencyId } from '@/services/specialization/specialization.service'

const bodySchema = z.object({
    email: z.string().email(),
    agency_id: z.string().uuid(),
    agency_site_url: z.string().url().optional(),
})

export async function POST(request: Request) {
    try {
        assertOtpEmailConfig()

        const body = bodySchema.parse(await request.json())
        const email = body.email.trim().toLowerCase()
        const agencyId = body.agency_id

        if (!isValidAgencyId(agencyId)) {
            return NextResponse.json(
                { success: false, message: 'Invalid agency.' },
                { status: 400 }
            )
        }

        const admin = createSupabaseAdminClient()

        // Branding first — fail before generating any Auth token if agency lookup fails.
        const branding = await loadBookingEmailBranding(
            admin,
            agencyId,
            body.agency_site_url ?? ''
        )

        const { otp } = await generateEmailOtp(admin, email)

        await sendVerificationOtpEmail({
            email,
            otp,
            agencyId,
            branding,
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        const message =
            error instanceof Error ? error.message : 'Unable to send verification code.'
        console.error('[api/auth/send-otp]', message)
        return NextResponse.json({ success: false, message }, { status: 500 })
    }
}
