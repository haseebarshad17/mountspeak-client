import {
    useMutation,
    useQuery,
    useQueryClient
} from '@tanstack/react-query'

import { authService } from './auth.service'
import { supabase } from '@/lib/supabase/supabase.client'


// service instance
const auth = authService({ supabase })


// LOGIN
export const useLogin = () => {
    return useMutation({
        mutationFn: auth.login
    })
}

// GOOGLE LOGIN
export const useGoogleLogin = () => {
    return useMutation({
        mutationFn: auth.loginWithGoogle
    })
}


// SIGNUP
export const useSignup = () => {
    return useMutation({
        mutationFn: auth.signup
    })
}

// FORGOT PASSWORD
export const useForgotPassword = () => {
    return useMutation({
        mutationFn: auth.resetPassword,
    })
}

// RESET PASSWORD
export const useUpdatePassword = () => {
    return useMutation({
        mutationFn: auth.updatePassword,
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