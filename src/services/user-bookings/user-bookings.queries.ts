import { useQuery } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase/supabase.client'

import { DEMO_PAST_BOOKINGS, DEMO_UPCOMING_BOOKINGS } from './user-bookings.demo'
import { userBookingsService } from './user-bookings.service'

const userBookings = userBookingsService({ supabase })

export type UseUserBookingsOptions = {
    agencyScoped?: boolean
    /** Pass `isAgencySite !== null` so agency sites wait for homepage context. */
    agencyContextResolved?: boolean
    /** Pass `isLoading` from `useOptionalUser()`. */
    isUserLoading?: boolean
}

function isUserBookingsQueryReady(
    email: string | null,
    agencyId: string | null | undefined,
    agencyScoped: boolean,
    agencyContextResolved: boolean,
): boolean {
    if (!agencyContextResolved) return false
    if (!email?.trim()) return false
    if (agencyScoped && !agencyId) return false
    return true
}

export const userBookingsQueryKey = (
    email: string | null,
    agencyId?: string | null,
) => ['user-bookings', email?.trim().toLowerCase() ?? 'anonymous', agencyId ?? 'all'] as const

export const useUserBookings = (
    email: string | null,
    agencyId?: string | null,
    options?: UseUserBookingsOptions,
) => {
    const agencyScoped = options?.agencyScoped ?? Boolean(agencyId)
    const agencyContextResolved = options?.agencyContextResolved ?? true
    const isUserLoading = options?.isUserLoading ?? false

    const queryReady = isUserBookingsQueryReady(
        email,
        agencyId,
        agencyScoped,
        agencyContextResolved,
    )

    const query = useQuery({
        queryKey: userBookingsQueryKey(email, agencyId),
        enabled: queryReady,
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

    const isBookingsLoading =
        isUserLoading ||
        !agencyContextResolved ||
        (agencyScoped && agencyContextResolved && !agencyId) ||
        (queryReady && query.isPending)

    return {
        ...query,
        isBookingsLoading,
    }
}
