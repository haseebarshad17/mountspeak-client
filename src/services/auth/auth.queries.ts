import {
    useMutation,
    useQuery,
    useQueryClient
} from '@tanstack/react-query'

import { authService } from './auth.service'
import { supabase } from '@/lib/supabase/supabase.client'


// service instance
const auth = authService({ supabase })


// MAGIC LINK (agency sites)
export const useMagicLinkSignIn = () => {
    return useMutation({
        mutationFn: auth.signInWithMagicLink,
    })
}

export const useSendBookingEmailOtp = () => {
    return useMutation({
        mutationFn: auth.sendBookingEmailOtp,
    })
}

export const useVerifyBookingEmailOtp = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: auth.verifyBookingEmailOtp,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['user'] })
            await queryClient.invalidateQueries({ queryKey: ['user-profile'] })
        },
    })
}

// GOOGLE LOGIN
export const useGoogleLogin = () => {
    return useMutation({
        mutationFn: auth.loginWithGoogle
    })
}


// LOGOUT
export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: auth.logout,
        onSuccess: async () => {
            // remove user and user profile cache
            queryClient.removeQueries({ queryKey: ['user'] });
            queryClient.removeQueries({ queryKey: ['user-profile'] });
        }
    })
}


// CURRENT USER (optional — never throws; safe for headers)
export const useOptionalUser = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: () => auth.getUser(),
        retry: false,
    })
}

// USER PROFILE (optional — safe for headers when logged in)
export const useOptionalUserProfile = () => {
    const { data: user } = useOptionalUser()

    return useQuery({
        queryKey: ['user-profile', user?.id ?? 'anonymous'],
        queryFn: async () => {
            if (!user?.id) return null

            const rows = await auth.getUserProfile(user.id)
            const profile = Array.isArray(rows) ? rows[0] : rows

            return profile ?? null
        },
        enabled: Boolean(user?.id),
        retry: false,
    })
}

// CURRENT USER
export const useUser = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const user = await auth.getUser();
            if (!user) throw new Error('User not authenticated');

            return user;
        }
    })
}


// USER PROFILE
export const useUserProfile = () => {
    return useQuery({
        queryKey: ['user-profile'],
        queryFn: async () => {
            const user = await auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const profile =
                await auth.getUserProfile(user.id);

            return profile;
        }
    })
}

export const getUserRole = async (userId: string) => {
    return auth.getUserRole(userId)
}