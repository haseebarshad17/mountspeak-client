import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase/supabase.client'

import { savedToursService } from './saved-tours.service'
import type { SavedListingKind } from './saved-tours.types'
import { savedListingKey } from './saved-tours.types'

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
            const keys = await savedTours.listSavedListingKeys(agencyId ?? undefined)
            return new Set(keys)
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
            listingKind?: SavedListingKind
            listingId?: string
            /** @deprecated Prefer listingId */
            tourId?: string
            agencyId: string
            currentlySaved: boolean
        }) => {
            const listingKind = payload.listingKind ?? 'tour'
            const listingId = payload.listingId ?? payload.tourId
            if (!listingId) {
                throw new Error('listingId is required')
            }

            if (payload.currentlySaved) {
                await savedTours.unsaveListing({
                    listingKind,
                    listingId,
                    agencyId: payload.agencyId,
                })
                return { saved: false as const, key: savedListingKey(listingKind, listingId) }
            }

            await savedTours.saveListing({
                listingKind,
                listingId,
                agencyId: payload.agencyId,
            })
            return { saved: true as const, key: savedListingKey(listingKind, listingId) }
        },
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['saved-tour-ids'] }),
                queryClient.invalidateQueries({ queryKey: ['saved-tours'] }),
            ])
        },
    })
}
