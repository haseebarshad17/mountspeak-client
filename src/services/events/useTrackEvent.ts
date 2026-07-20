'use client'

import { useCallback, useRef } from 'react'
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
    const contextRef = useRef({ isAgencySite, agencyId })

    contextRef.current = { isAgencySite, agencyId }

    return useCallback(
        (payload: Omit<TrackEventPayload, 'agency_id'> & { agency_id?: string | null }) => {
            const { isAgencySite: readySite, agencyId: readyAgencyId } = contextRef.current

            if (readySite !== true || !readyAgencyId || readyAgencyId === DEFAULT_AGENCY_ID) {
                return false
            }

            void trackEvent({
                ...payload,
                agency_id: payload.agency_id ?? readyAgencyId,
            })

            return true
        },
        [],
    )
}
