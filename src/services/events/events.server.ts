import type { SupabaseClient } from '@supabase/supabase-js'
import { DEFAULT_AGENCY_ID } from '@/lib/homepage/default-homepage'
import type { EventType } from '@/services/events/events.types'

type RecordServerEventParams = {
    supabase: SupabaseClient
    agencyId: string | null | undefined
    eventType: EventType | string
    path?: string | null
    entityType?: string | null
    entityId?: string | null
    sessionId?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    metadata?: Record<string, unknown>
}

/** Server-side event insert via RPC. Never throws. */
export async function recordServerEvent(params: RecordServerEventParams): Promise<void> {
    try {
        const agencyId = params.agencyId?.trim()
        if (!agencyId || agencyId === DEFAULT_AGENCY_ID) return

        const eventType = params.eventType?.trim()
        if (!eventType) return

        const { error } = await params.supabase.rpc('record_agency_event', {
            p_agency_id: agencyId,
            p_event_type: eventType,
            p_path: params.path ?? null,
            p_entity_type: params.entityType ?? null,
            p_entity_id: params.entityId ?? null,
            p_session_id: params.sessionId ?? null,
            p_ip_address: params.ipAddress ?? null,
            p_user_agent: params.userAgent ?? null,
            p_metadata: params.metadata ?? {},
        })

        if (error) {
            console.error('[recordServerEvent]', error.message)
        }
    } catch (error) {
        console.error('[recordServerEvent]', error)
    }
}
