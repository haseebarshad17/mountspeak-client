import { useQuery } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase/supabase.client'

import { DEMO_PAST_BOOKINGS, DEMO_UPCOMING_BOOKINGS } from './user-bookings.demo'
import { userBookingsService } from './user-bookings.service'

const userBookings = userBookingsService({ supabase })

export const userBookingsQueryKey = (email: string | null) =>
    ['user-bookings', email?.trim().toLowerCase() ?? 'anonymous'] as const

export const useUserBookings = (email: string | null) => {
    return useQuery({
        queryKey: userBookingsQueryKey(email),
        enabled: Boolean(email?.trim()),
        queryFn: async () => {
            const result = await userBookings.fetchUserBookings(email ?? '')

            if (result.hasLiveData) {
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
