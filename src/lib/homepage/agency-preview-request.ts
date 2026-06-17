import { cache } from 'react'

/**
 * Per-request agency host override for localhost preview routes
 * (`/:agencyHost/...`). Set from the preview layout before data fetching.
 */
const previewHostStore = cache(() => ({ value: null as string | null }))

export function setAgencyPreviewHostForRequest(host: string | null): void {
    previewHostStore().value = host
}

export function readAgencyPreviewHostForRequest(): string | null {
    return previewHostStore().value
}
