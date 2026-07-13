'use client'

import { useCallback } from 'react'
import { DEFAULT_AGENCY_ID } from '@/lib/homepage/default-homepage'
import { trackEvent } from '@/services/events/events.service'
import type { TrackEventPayload } from '@/services/events/events.types'
import {
    selectHomepageAgencyId,
    selectIsAgencySite,
} from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'

/** Client helper that only tracks on real agency sites. */
export function useTrackEvent() {
    const isAgencySite = useAppSelector(selectIsAgencySite)
    const agencyId = useAppSelector(selectHomepageAgencyId)

    return useCallback(
        (payload: Omit<TrackEventPayload, 'agency_id'> & { agency_id?: string | null }) => {
            if (!isAgencySite || !agencyId || agencyId === DEFAULT_AGENCY_ID) {
                return
            }

            void trackEvent({
                ...payload,
                agency_id: payload.agency_id ?? agencyId,
            })
        },
        [agencyId, isAgencySite],
    )
}
