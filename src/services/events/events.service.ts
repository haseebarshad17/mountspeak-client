import { DEFAULT_AGENCY_ID } from '@/lib/homepage/default-homepage'
import { getOrCreateEventSessionId } from './events.session'
import type { TrackEventPayload } from './events.types'

/**
 * Fire-and-forget analytics tracker for agency sites.
 * Never throws — booking/login UX must not depend on analytics.
 */
export async function trackEvent(payload: TrackEventPayload): Promise<void> {
    try {
        const eventType = payload.event_type?.trim()
        if (!eventType) return

        const body = {
            event_type: eventType,
            path: payload.path ?? (typeof window !== 'undefined' ? window.location.pathname : null),
            entity_type: payload.entity_type ?? null,
            entity_id: payload.entity_id ?? null,
            metadata: payload.metadata ?? {},
            agency_id: payload.agency_id ?? null,
            session_id: getOrCreateEventSessionId(),
        }

        void fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            keepalive: true,
        }).catch(() => {
            // swallow network errors
        })
    } catch {
        // swallow
    }
}

/** Fire SIGNOUT before clearing the session. Never throws. */
export async function trackLogoutEvent(agencyId?: string | null): Promise<void> {
    const id = agencyId?.trim()
    if (!id || id === DEFAULT_AGENCY_ID) return

    await trackEvent({
        event_type: 'SIGNOUT',
        path: typeof window !== 'undefined' ? window.location.pathname : '/logout',
        agency_id: id,
    })
}
