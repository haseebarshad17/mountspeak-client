import type { SupabaseClient } from '@supabase/supabase-js'
import { MessageCode } from '@/lib/messages/codes'
import { mapAuthErrorToMessageCode } from '@/lib/auth/map-auth-error'
import type {
    BookingEmailOtpDTO,
    GoogleLoginDTO,
    MagicLinkDTO,
    VerifyBookingEmailOtpDTO,
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
        throw new Error(MessageCode.AUTH_CUSTOMER_SITE_ACCESS_DENIED)
    }
}

async function completeAgencySiteAuth(supabase: SupabaseClient, agencyId: string) {
    await ensureSiteMembership(supabase, agencyId)
    await assertSiteCustomerAccess(supabase, agencyId)
}

export const authService = ({ supabase }: AuthServiceProps) => ({
    ensureSiteMembership: async (agencyId: string) => {
        await ensureSiteMembership(supabase, agencyId)
    },

    assertSiteCustomerAccess: async (agencyId: string) => {
        await assertSiteCustomerAccess(supabase, agencyId)
    },

    completeAgencySiteAuth: async (agencyId: string) => {
        await completeAgencySiteAuth(supabase, agencyId)
    },

    // Magic link (agency customer sites)
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

        if (error) {
            throw new Error(mapAuthErrorToMessageCode(error, 'login'))
        }
    },

    /** Same OTP email as magic link; used on booking Details for guests. */
    sendBookingEmailOtp: async (payload: BookingEmailOtpDTO) => {
        const { error } = await supabase.auth.signInWithOtp({
            email: payload.email.trim().toLowerCase(),
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

        if (error) {
            throw new Error(mapAuthErrorToMessageCode(error, 'login'))
        }
    },

    verifyBookingEmailOtp: async (payload: VerifyBookingEmailOtpDTO) => {
        const email = payload.email.trim().toLowerCase()
        const token = payload.token.trim()

        let { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'email',
        })

        if (error) {
            ;({ data, error } = await supabase.auth.verifyOtp({
                email,
                token,
                type: 'magiclink',
            }))
        }

        if (error) {
            throw new Error(mapAuthErrorToMessageCode(error, 'login'))
        }

        const agencyId = payload.agency_id?.trim()
        if (agencyId) {
            try {
                await completeAgencySiteAuth(supabase, agencyId)
            } catch (accessError) {
                if (
                    accessError instanceof Error &&
                    accessError.message === MessageCode.AUTH_CUSTOMER_SITE_ACCESS_DENIED
                ) {
                    throw accessError
                }
                throw new Error(mapAuthErrorToMessageCode(accessError, 'login'))
            }
        }

        return data.user
    },

    // Google OAuth Login
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

    // Logout
    logout: async () => {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    },

    // Get User
    getUser: async () => {
        const { data, error } = await supabase.auth.getUser()

        if (error) throw error

        return data.user
    },

    // Get User Profile
    getUserProfile: async (userId: string) => {
        const { data, error } = await supabase.from('users').select('*').eq('id', userId)

        if (error) throw error

        return data
    },

    getUserRole: async (userId: string) => {
        const { data, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', userId)
            .single()

        if (error) throw error

        return data.role as string
    },
})
