import type { SupabaseClient } from '@supabase/supabase-js'
import type {
    GoogleLoginDTO,
    MagicLinkDTO,
    SendEmailOtpDTO,
    VerifyEmailOtpDTO,
} from './auth.types'

type AuthServiceProps = { supabase: SupabaseClient }

async function ensureSiteMembership(supabase: SupabaseClient, agencyId: string) {
    const { error } = await supabase.rpc('ensure_agency_client_membership', {
        p_agency_id: agencyId,
    })
    if (error) throw error
}

async function assertSiteCustomerAccess(supabase: SupabaseClient, agencyId: string) {
    const { data, error } = await supabase.rpc('can_access_agency_customer_site', {
        p_agency_id: agencyId,
    })
    if (error) throw error
    if (!data) {
        await supabase.auth.signOut()
        throw new Error('You do not have access to this agency site.')
    }
}

export async function completeAgencySiteAuth(
    supabase: SupabaseClient,
    agencyId: string
) {
    await ensureSiteMembership(supabase, agencyId)
    await assertSiteCustomerAccess(supabase, agencyId)
}

export function authService({ supabase }: AuthServiceProps) {
    return {
        signInWithMagicLink: async (payload: MagicLinkDTO) => {
            const { error } = await supabase.auth.signInWithOtp({
                email: payload.email,
                options: {
                    shouldCreateUser: true,
                    emailRedirectTo: payload.emailRedirectTo,
                    data: {
                        ...(payload.agency_id ? { agency_id: payload.agency_id } : {}),
                        ...(payload.agency_site_url
                            ? { agency_site_url: payload.agency_site_url }
                            : {}),
                    },
                },
            })
            if (error) throw error
        },

        /**
         * Sends a one-time code via send-email event `VERIFICATION_OTP`
         * (branded OTP email — not Auth magic-link).
         */
        sendEmailOtp: async (payload: SendEmailOtpDTO) => {
            const email = payload.email.trim().toLowerCase()
            if (!payload.agency_id) {
                throw new Error('Agency is required to send a verification code.')
            }

            const response = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    agency_id: payload.agency_id,
                    ...(payload.agency_site_url
                        ? { agency_site_url: payload.agency_site_url }
                        : {}),
                }),
            })

            const data = (await response.json().catch(() => ({}))) as {
                success?: boolean
                message?: string
            }

            if (!response.ok || data.success === false) {
                throw new Error(data.message ?? 'Unable to send verification code.')
            }
        },

        /** Verifies the emailed 6-digit code and completes agency site membership. */
        verifyEmailOtp: async (payload: VerifyEmailOtpDTO) => {
            const email = payload.email.trim().toLowerCase()
            const token = payload.token.trim()

            // Historical booking verify tried `email` then `magiclink`; keep signup as last resort.
            const types = ['email', 'magiclink', 'signup'] as const
            let lastError: Error | null = null
            let user = null

            for (const type of types) {
                const { data, error } = await supabase.auth.verifyOtp({
                    email,
                    token,
                    type,
                })
                if (!error && data.session?.user) {
                    user = data.session.user
                    break
                }
                if (error) lastError = error
            }

            if (!user) {
                throw lastError ?? new Error('Could not verify email. Please try again.')
            }

            await completeAgencySiteAuth(supabase, payload.agency_id)
            return user
        },

        loginWithGoogle: async ({ redirectTo, agency_id }: GoogleLoginDTO) => {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo,
                    ...(agency_id ? { data: { agency_id } } : {}),
                },
            })
            if (error) throw error
            return data
        },

        logout: async () => {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
        },

        getUser: async () => {
            const { data, error } = await supabase.auth.getUser()
            if (error) throw error
            return data.user
        },

        completeAgencySiteAuth: async (agencyId: string) => {
            await completeAgencySiteAuth(supabase, agencyId)
        },
    }
}
