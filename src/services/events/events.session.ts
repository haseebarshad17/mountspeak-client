const SESSION_STORAGE_KEY = 'ms_event_session_id'

function createSessionId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID()
    }

    return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

/** Stable anon session id for correlating events across a browser. */
export function getOrCreateEventSessionId(): string {
    if (typeof window === 'undefined') return ''

    try {
        const existing = window.localStorage.getItem(SESSION_STORAGE_KEY)?.trim()
        if (existing) return existing

        const next = createSessionId()
        window.localStorage.setItem(SESSION_STORAGE_KEY, next)
        return next
    } catch {
        return createSessionId()
    }
}
