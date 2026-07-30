'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/supabase.client'
import { useOptionalUser } from '@/services/auth/auth.query'
import { userProfileService } from './user-profile.service'
import type { UpdateUserProfileInput } from './user-profile.types'

const profile = userProfileService({ supabase })

export const userProfileQueryKeys = {
    all: ['user-profile'] as const,
    byId: (id: string) => [...userProfileQueryKeys.all, id] as const,
}

export function useUserProfile() {
    const { data: user } = useOptionalUser()

    return useQuery({
        queryKey: userProfileQueryKeys.byId(user?.id ?? ''),
        enabled: Boolean(user?.id),
        queryFn: () =>
            profile.getProfile(user!.id, user!.email ?? ''),
        retry: false,
    })
}

export function useUpdateUserProfile() {
    const queryClient = useQueryClient()
    const { data: user } = useOptionalUser()

    return useMutation({
        mutationFn: (input: UpdateUserProfileInput) => {
            if (!user?.id) throw new Error('Not signed in')
            return profile.updateProfile(user.id, user.email ?? '', input)
        },
        onSuccess: (data) => {
            queryClient.setQueryData(userProfileQueryKeys.byId(data.id), data)
        },
    })
}
