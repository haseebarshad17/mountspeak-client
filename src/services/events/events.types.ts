export const EVENT_TYPES = [
    'LOGIN',
    'SIGNUP',
    'SIGNOUT',
    'TOUR_VIEW',
    'TOUR_SEARCH',
    'BOOKING_STARTED',
    'BOOKING_SUCCESS',
    'BOOKING_FAILED',
    'PAGE_VIEW',
] as const

export type EventType = (typeof EVENT_TYPES)[number]

export type TrackEventPayload = {
    event_type: EventType | string
    path?: string | null
    entity_type?: string | null
    entity_id?: string | null
    metadata?: Record<string, unknown>
    /** Optional override; normally resolved server-side from agency homepage. */
    agency_id?: string | null
}

export type TrackEventRequestBody = TrackEventPayload & {
    session_id?: string | null
}
