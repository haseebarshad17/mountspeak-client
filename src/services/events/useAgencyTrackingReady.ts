'use client'

import { DEFAULT_AGENCY_ID } from '@/lib/homepage/default-homepage'
import {
    selectHomepageAgencyId,
    selectIsAgencySite,
} from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'

/** True once homepage context confirms a real agency site (not while loading). */
export function useAgencyTrackingReady(): boolean {
    const isAgencySite = useAppSelector(selectIsAgencySite)
    const agencyId = useAppSelector(selectHomepageAgencyId)

    return (
        isAgencySite === true &&
        Boolean(agencyId) &&
        agencyId !== DEFAULT_AGENCY_ID
    )
}
