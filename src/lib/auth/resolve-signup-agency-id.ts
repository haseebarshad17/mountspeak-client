import { DEFAULT_AGENCY_ID } from '@/lib/homepage/default-homepage'
import type { AgencyHomepage } from '@/services/homepage/homepage.types'

export async function fetchSignupAgencyId(): Promise<string | undefined> {
    try {
        const response = await fetch('/api/homepage', {
            method: 'GET',
            headers: { Accept: 'application/json' },
            cache: 'no-store',
        })

        if (!response.ok) return undefined

        const homepage = (await response.json()) as AgencyHomepage

        if (
            !homepage.isAgencySite ||
            !homepage.agencyId ||
            homepage.agencyId === DEFAULT_AGENCY_ID
        ) {
            return undefined
        }

        return homepage.agencyId
    } catch {
        return undefined
    }
}
