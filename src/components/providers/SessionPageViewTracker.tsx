'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

import { getOrCreateEventSessionId } from '@/services/events/events.session'
import { useAgencyTrackingReady } from '@/services/events/useAgencyTrackingReady'
import { useTrackEvent } from '@/services/events/useTrackEvent'

const SESSION_PAGE_VIEW_KEY = 'page_view'

function hasTrackedSessionPageView(sessionId: string): boolean {
    try {
        return Boolean(sessionStorage.getItem(`${SESSION_PAGE_VIEW_KEY}:${sessionId}`))
    } catch {
        return false
    }
}

function markSessionPageViewTracked(sessionId: string): void {
    try {
        sessionStorage.setItem(`${SESSION_PAGE_VIEW_KEY}:${sessionId}`, '1')
    } catch {
        // private mode / blocked storage
    }
}

/** Records one PAGE_VIEW per browser session to measure unique site visitors. */
export default function SessionPageViewTracker() {
    const pathname = usePathname()
    const isTrackingReady = useAgencyTrackingReady()
    const trackEvent = useTrackEvent()

    useEffect(() => {
        if (!isTrackingReady) return

        const sessionId = getOrCreateEventSessionId()
        if (!sessionId || hasTrackedSessionPageView(sessionId)) {
            return
        }

        const tracked = trackEvent({
            event_type: 'PAGE_VIEW',
            path: pathname,
            metadata: {
                entry_path: pathname,
            },
        })

        if (tracked) {
            markSessionPageViewTracked(sessionId)
        }
    }, [isTrackingReady, pathname, trackEvent])

    return null
}
