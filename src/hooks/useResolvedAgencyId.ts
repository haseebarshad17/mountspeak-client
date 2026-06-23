'use client'

import { useMemo } from 'react'

import { DEFAULT_AGENCY_ID } from '@/lib/homepage/default-homepage'
import { selectHomepageAgencyId, selectIsAgencySite } from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'

export function useResolvedAgencyId() {
    const agencyId = useAppSelector(selectHomepageAgencyId)
    const isAgencySite = useAppSelector(selectIsAgencySite)

    const resolvedAgencyId = useMemo(() => {
        if (!agencyId || agencyId === DEFAULT_AGENCY_ID) {
            return undefined
        }

        return agencyId
    }, [agencyId])

    return {
        resolvedAgencyId,
        isAgencySite,
        isReady: isAgencySite !== null,
    }
}
