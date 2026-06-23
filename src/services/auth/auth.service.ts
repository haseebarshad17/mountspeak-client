import type { SupabaseClient } from '@supabase/supabase-js'
import { MessageCode } from '@/lib/messages/codes'
import type {
    ForgotPasswordDTO,
    GoogleLoginDTO,
    LoginDTO,
    ResendVerificationDTO,
    ResetPasswordDTO,
    SignupDTO
} from './auth.types'


type AuthServiceProps = { supabase: SupabaseClient }

async function getUserAgencyId(
    supabase: SupabaseClient,
    userId: string,
): Promise<string | null> {
    const { data, error } = await supabase
        .from('users')
        .select('agency_id')
        .eq('id', userId)
        .single()

    if (error) throw error

    return (data.agency_id as string | null) ?? null
}

async function bindUserToAgency(
    supabase: SupabaseClient,
    userId: string,
    agencyId: string,
) {
    const { error: metadataError } = await supabase.auth.updateUser({
        data: { agency_id: agencyId },
    })

    if (metadataError) throw metadataError

    const { error: profileError } = await supabase
        .from('users')
        .update({ agency_id: agencyId })
        .eq('id', userId)

    if (profileError) throw profileError
}

async function enforceAgencyAccess(
    supabase: SupabaseClient,
    userId: string,
    agencyId: string,
) {
    const userAgencyId = await getUserAgencyId(supabase, userId)

    if (userAgencyId && userAgencyId !== agencyId) {
        await supabase.auth.signOut()
        throw new Error(MessageCode.AUTH_AGENCY_MISMATCH)
    }

    if (!userAgencyId) {
        await bindUserToAgency(supabase, userId, agencyId)
    }
}

export const authService = ({ supabase }: AuthServiceProps) => {
    return {
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
                        }
                    }
                })

            if (error) throw error

            return data
        },

        // Login 
        login: async (payload: LoginDTO) => {
            const { data, error } =
                await supabase.auth.signInWithPassword({
                    email: payload.email,
                    password: payload.password
                })

            if (error) throw error

            if (data.user && payload.agency_id) {
                await enforceAgencyAccess(supabase, data.user.id, payload.agency_id)
            }

            return data
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

        resendVerificationEmail: async (payload: ResendVerificationDTO) => {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: payload.email,
                options: { emailRedirectTo: payload.emailRedirectTo },
            })

            if (error) throw error
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

        persistUserAgencyId: async (userId: string, agencyId: string) => {
            const { error } = await supabase
                .from('users')
                .update({ agency_id: agencyId })
                .eq('id', userId)

            if (error) throw error
        },
    }
}