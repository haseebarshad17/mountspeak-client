import type { SupabaseClient } from '@supabase/supabase-js'
import type {
    LoginDTO,
    SignupDTO
} from './auth.types'


type AuthServiceProps = { supabase: SupabaseClient }

export const authService = ({ supabase }: AuthServiceProps) => {
    return {
        // Signup 
        signup: async (payload: SignupDTO) => {
            const { data, error } =
                await supabase.auth.signUp({
                    email: payload.email,
                    password: payload.password,

                    options: {
                        data: {
                            full_name: payload.full_name,
                            role: payload.role,
                            avatar_url: payload.avatar_url ?? ""
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

            return data
        },

        // Google OAuth Login
        loginWithGoogle: async (redirectTo: string) => {
            const { data, error } =
                await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: { redirectTo }
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
        }
    }
}