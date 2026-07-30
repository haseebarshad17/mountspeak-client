export type SavedListing = {
    id: string
    kind: 'tours' | 'packages' | 'international'
    title: string
    location: string
    priceLabel: string
    imageUrl: string | null
    href: string
    savedAt: string
}

function storageKey(userId: string, agencyId: string) {
    return `mountspeak:saved:${agencyId}:${userId}`
}

export function getSavedListings(userId: string, agencyId: string): SavedListing[] {
    if (typeof window === 'undefined') return []
    try {
        const raw = window.localStorage.getItem(storageKey(userId, agencyId))
        if (!raw) return []
        const parsed = JSON.parse(raw) as SavedListing[]
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

export function setSavedListings(
    userId: string,
    agencyId: string,
    items: SavedListing[]
) {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(storageKey(userId, agencyId), JSON.stringify(items))
    window.dispatchEvent(new Event('mountspeak:saved-changed'))
}

export function isListingSaved(
    userId: string,
    agencyId: string,
    listingId: string
) {
    return getSavedListings(userId, agencyId).some((item) => item.id === listingId)
}

export function toggleSavedListing(
    userId: string,
    agencyId: string,
    listing: Omit<SavedListing, 'savedAt'>
): boolean {
    const current = getSavedListings(userId, agencyId)
    const exists = current.some((item) => item.id === listing.id)
    const next = exists
        ? current.filter((item) => item.id !== listing.id)
        : [{ ...listing, savedAt: new Date().toISOString() }, ...current]
    setSavedListings(userId, agencyId, next)
    return !exists
}

export function removeSavedListing(
    userId: string,
    agencyId: string,
    listingId: string
) {
    setSavedListings(
        userId,
        agencyId,
        getSavedListings(userId, agencyId).filter((item) => item.id !== listingId)
    )
}
