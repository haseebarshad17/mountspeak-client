import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase/supabase.client'

import { savedToursService } from './saved-tours.service'

const savedTours = savedToursService({ supabase })

export type UseSavedToursOptions = {
    agencyScoped?: boolean
    agencyContextResolved?: boolean
    isUserLoading?: boolean
    enabled?: boolean
}

export const savedTourIdsQueryKey = (userId: string | null, agencyId?: string | null) =>
    ['saved-tour-ids', userId ?? 'anonymous', agencyId ?? 'all'] as const

export const savedToursQueryKey = (userId: string | null, agencyId?: string | null) =>
    ['saved-tours', userId ?? 'anonymous', agencyId ?? 'all'] as const

function isSavedToursQueryReady(
    userId: string | null,
    agencyId: string | null | undefined,
    agencyScoped: boolean,
    agencyContextResolved: boolean,
    enabled: boolean,
): boolean {
    if (!enabled) return false
    if (!agencyContextResolved) return false
    if (!userId) return false
    if (agencyScoped && !agencyId) return false
    return true
}

export const useSavedTourIds = (
    userId: string | null,
    agencyId?: string | null,
    options?: UseSavedToursOptions,
) => {
    const agencyScoped = options?.agencyScoped ?? Boolean(agencyId)
    const agencyContextResolved = options?.agencyContextResolved ?? true
    const enabled = options?.enabled ?? true

    const queryReady = isSavedToursQueryReady(
        userId,
        agencyId,
        agencyScoped,
        agencyContextResolved,
        enabled,
    )

    return useQuery({
        queryKey: savedTourIdsQueryKey(userId, agencyId),
        enabled: queryReady,
        queryFn: async () => {
            const ids = await savedTours.listSavedTourIds(agencyId ?? undefined)
            return new Set(ids)
        },
        staleTime: 30_000,
    })
}

export const useSavedTours = (
    userId: string | null,
    agencyId?: string | null,
    options?: UseSavedToursOptions,
) => {
    const agencyScoped = options?.agencyScoped ?? Boolean(agencyId)
    const agencyContextResolved = options?.agencyContextResolved ?? true
    const isUserLoading = options?.isUserLoading ?? false
    const enabled = options?.enabled ?? true

    const queryReady = isSavedToursQueryReady(
        userId,
        agencyId,
        agencyScoped,
        agencyContextResolved,
        enabled,
    )

    const query = useQuery({
        queryKey: savedToursQueryKey(userId, agencyId),
        enabled: queryReady,
        queryFn: () => savedTours.listSavedTours(agencyId ?? undefined),
    })

    const isSavedToursLoading =
        isUserLoading ||
        !agencyContextResolved ||
        (agencyScoped && agencyContextResolved && !agencyId) ||
        (queryReady && query.isPending)

    return {
        ...query,
        isSavedToursLoading,
    }
}

export const useToggleSavedTour = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: {
            tourId: string
            agencyId: string
            currentlySaved: boolean
        }) => {
            if (payload.currentlySaved) {
                await savedTours.unsaveTour({
                    tourId: payload.tourId,
                    agencyId: payload.agencyId,
                })
                return { saved: false as const }
            }

            await savedTours.saveTour({
                tourId: payload.tourId,
                agencyId: payload.agencyId,
            })
            return { saved: true as const }
        },
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['saved-tour-ids'] }),
                queryClient.invalidateQueries({ queryKey: ['saved-tours'] }),
            ])
        },
    })
}
