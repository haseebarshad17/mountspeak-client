import type { Session, SupabaseClient } from '@supabase/supabase-js'
import { isEmailAlreadyRegisteredError } from '@/lib/auth/map-auth-error'
import { MessageCode } from '@/lib/messages/codes'
import { mapAuthErrorToMessageCode } from '@/lib/auth/map-auth-error'
import type {
    ForgotPasswordDTO,
    GoogleLoginDTO,
    LoginDTO,
    MagicLinkDTO,
    ResetPasswordDTO,
    SignupDTO
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

async function completeAgencySiteAuth(
    supabase: SupabaseClient,
    agencyId: string,
) {
    await ensureSiteMembership(supabase, agencyId)
    await assertSiteCustomerAccess(supabase, agencyId)
}

async function runAgencySiteAuthWhenSession(
    supabase: SupabaseClient,
    agencyId: string,
    session: Session | null | undefined,
) {
    if (!session) return

    await completeAgencySiteAuth(supabase, agencyId)
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

    // Signup
    signup: async (payload: SignupDTO) => {
        const { data, error } =
            await supabase.auth.signUp({
                email: payload.email,
                password: payload.password,

                options: {
                    emailRedirectTo: payload.emailRedirectTo,
                    data: {
                        full_name: payload.full_name,
                        role: payload.role,
                        avatar_url: payload.avatar_url ?? "",
                        ...(payload.agency_id ? { agency_id: payload.agency_id } : {}),
                        ...(payload.agency_site_url
                            ? { agency_site_url: payload.agency_site_url }
                            : {}),
                    }
                }
            })

        if (error) {
            if (payload.agency_id && isEmailAlreadyRegisteredError(error)) {
                const loginResult = await supabase.auth.signInWithPassword({
                    email: payload.email,
                    password: payload.password,
                })

                if (loginResult.error) {
                    throw new Error(MessageCode.API_AUTH_LOGIN_FAILED)
                }

                await runAgencySiteAuthWhenSession(
                    supabase,
                    payload.agency_id,
                    loginResult.data.session,
                )
                return loginResult.data
            }

            throw new Error(mapAuthErrorToMessageCode(error, 'signup'))
        }

        if (data.user?.identities?.length === 0) {
            if (payload.agency_id) {
                const loginResult = await supabase.auth.signInWithPassword({
                    email: payload.email,
                    password: payload.password,
                })

                if (loginResult.error) {
                    throw new Error(MessageCode.API_AUTH_LOGIN_FAILED)
                }

                await runAgencySiteAuthWhenSession(
                    supabase,
                    payload.agency_id,
                    loginResult.data.session,
                )
                return loginResult.data
            }

            throw new Error(MessageCode.AUTH_EMAIL_ALREADY_REGISTERED)
        }

        if (data.user && payload.agency_id) {
            await runAgencySiteAuthWhenSession(supabase, payload.agency_id, data.session)
        }

        return data
    },

    // Login
    login: async (payload: LoginDTO) => {
        const { data, error } =
            await supabase.auth.signInWithPassword({
                email: payload.email,
                password: payload.password
            })

        if (error) {
            throw new Error(mapAuthErrorToMessageCode(error, 'login'))
        }

        if (data.user && payload.agency_id) {
            await runAgencySiteAuthWhenSession(supabase, payload.agency_id, data.session)
        }

        return data
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

    // Google OAuth Login
    loginWithGoogle: async ({ redirectTo, agency_id }: GoogleLoginDTO) => {
        const { data, error } =
            await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo,
                    ...(agency_id
                        ? { data: { agency_id } }
                        : {}),
                }
            })

        if (error) throw error

        return data
    },

    // Forgot password
    resetPassword: async (payload: ForgotPasswordDTO) => {
        const { error } = await supabase.auth.resetPasswordForEmail(
            payload.email,
            { redirectTo: payload.redirectTo },
        )

        if (error) throw error
    },

    // Set new password (after email reset link)
    updatePassword: async (payload: ResetPasswordDTO) => {
        const { data, error } = await supabase.auth.updateUser({
            password: payload.password,
        })

        if (error) throw error

        return data
    },

    // Logout
    logout: async () => {
        const { error } =
            await supabase.auth.signOut()
        if (error) throw error
    },

    // Get User
    getUser: async () => {
        const { data, error } =
            await supabase.auth.getUser()

        if (error) throw error

        return data.user
    },

    // Get User Profile
    getUserProfile: async (userId: string) => {
        const { data, error } =
            await supabase.from("users").select("*").eq("id", userId)

        if (error) throw error

        return data
    },

    getUserRole: async (userId: string) => {
        const { data, error } =
            await supabase
                .from("users")
                .select("role")
                .eq("id", userId)
                .single()

        if (error) throw error

        return data.role as string
    },
})
