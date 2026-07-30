'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/supabase.client'
import { authService } from './auth.service'

const auth = authService({ supabase })

export const authQueryKeys = {
    user: ['auth', 'user'] as const,
}

export function useMagicLinkSignIn() {
    return useMutation({
        mutationFn: auth.signInWithMagicLink,
    })
}

export function useGoogleLogin() {
    return useMutation({
        mutationFn: auth.loginWithGoogle,
    })
}

export function useLogout() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: auth.logout,
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: authQueryKeys.user })
        },
    })
}

export function useOptionalUser() {
    return useQuery({
        queryKey: authQueryKeys.user,
        queryFn: async () => {
            try {
                return await auth.getUser()
            } catch {
                return null
            }
        },
        retry: false,
        staleTime: 1000 * 60,
    })
}
