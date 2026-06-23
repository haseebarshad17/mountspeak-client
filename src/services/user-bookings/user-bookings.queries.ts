import { useQuery } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase/supabase.client'

import { DEMO_PAST_BOOKINGS, DEMO_UPCOMING_BOOKINGS } from './user-bookings.demo'
import { userBookingsService } from './user-bookings.service'

const userBookings = userBookingsService({ supabase })

export const userBookingsQueryKey = (
    email: string | null,
    agencyId?: string | null,
) => ['user-bookings', email?.trim().toLowerCase() ?? 'anonymous', agencyId ?? 'all'] as const

export const useUserBookings = (
    email: string | null,
    agencyId?: string | null,
    options?: { agencyScoped?: boolean },
) => {
    const agencyScoped = options?.agencyScoped ?? Boolean(agencyId)

    return useQuery({
        queryKey: userBookingsQueryKey(email, agencyId),
        enabled: Boolean(email?.trim()) && (!agencyScoped || Boolean(agencyId)),
        queryFn: async () => {
            const result = await userBookings.fetchUserBookings({
                email: email ?? '',
                ...(agencyId ? { agencyId } : {}),
            })

            if (result.hasLiveData || agencyScoped) {
                return result
            }

            return {
                upcoming: DEMO_UPCOMING_BOOKINGS,
                past: DEMO_PAST_BOOKINGS,
                hasLiveData: false,
            }
        },
    })
}
