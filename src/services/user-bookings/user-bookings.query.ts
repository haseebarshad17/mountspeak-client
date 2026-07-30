'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/supabase.client'
import { getUserBookings } from './user-bookings.service'

export const userBookingsQueryKeys = {
    all: ['user-bookings'] as const,
    byEmail: (email: string, agencyId?: string) =>
        [...userBookingsQueryKeys.all, email, agencyId ?? 'all'] as const,
}

export function useUserBookings(email?: string | null, agencyId?: string) {
    return useQuery({
        queryKey: userBookingsQueryKeys.byEmail(email ?? '', agencyId),
        enabled: Boolean(email?.trim()),
        queryFn: () =>
            getUserBookings({
                supabase,
                email: email as string,
                agencyId,
            }),
    })
}
