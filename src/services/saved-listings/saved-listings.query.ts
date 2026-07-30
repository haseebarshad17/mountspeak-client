'use client'

import { useCallback, useEffect, useState } from 'react'
import { useOptionalUser } from '@/services/auth/auth.query'
import {
    getSavedListings,
    removeSavedListing,
    type SavedListing,
} from './saved-listings.store'

export function useSavedListings(agencyId: string) {
    const { data: user } = useOptionalUser()
    const [items, setItems] = useState<SavedListing[]>([])

    const refresh = useCallback(() => {
        if (!user?.id || !agencyId) {
            setItems([])
            return
        }
        setItems(getSavedListings(user.id, agencyId))
    }, [agencyId, user?.id])

    useEffect(() => {
        refresh()
        const onChange = () => refresh()
        window.addEventListener('mountspeak:saved-changed', onChange)
        window.addEventListener('storage', onChange)
        return () => {
            window.removeEventListener('mountspeak:saved-changed', onChange)
            window.removeEventListener('storage', onChange)
        }
    }, [refresh])

    function remove(listingId: string) {
        if (!user?.id) return
        removeSavedListing(user.id, agencyId, listingId)
        refresh()
    }

    return { items, remove, refresh, userId: user?.id ?? null }
}
