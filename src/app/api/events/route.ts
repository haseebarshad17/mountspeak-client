import { NextRequest, NextResponse } from 'next/server'
import { DEFAULT_AGENCY_ID } from '@/lib/homepage/default-homepage'
import { createServerSupabase } from '@/lib/supabase/supabase.server'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'

function resolveClientIp(request: NextRequest): string | null {
    const forwarded = request.headers.get('x-forwarded-for')
    if (forwarded) {
        const first = forwarded.split(',')[0]?.trim()
        if (first) return first
    }

    const realIp = request.headers.get('x-real-ip')?.trim()
    return realIp || null
}

type EventsBody = {
    event_type?: unknown
    path?: unknown
    entity_type?: unknown
    entity_id?: unknown
    session_id?: unknown
    metadata?: unknown
    agency_id?: unknown
}

function asOptionalString(value: unknown): string | null {
    if (typeof value !== 'string') return null
    const trimmed = value.trim()
    return trimmed || null
}

function asOptionalUuid(value: unknown): string | null {
    const text = asOptionalString(value)
    if (!text) return null
    if (
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            text,
        )
    ) {
        return null
    }
    return text
}

export async function POST(request: NextRequest) {
    let body: EventsBody
    try {
        body = (await request.json()) as EventsBody
    } catch {
        return NextResponse.json({ success: false, error: 'invalid_payload' }, { status: 400 })
    }

    const eventType = asOptionalString(body.event_type)
    if (!eventType) {
        return NextResponse.json({ success: false, error: 'event_type_required' }, { status: 400 })
    }

    try {
        const homepage = await fetchAgencyHomepage()
        const homepageAgencyId =
            homepage.isAgencySite &&
            homepage.agencyId &&
            homepage.agencyId !== DEFAULT_AGENCY_ID
                ? homepage.agencyId
                : null

        const bodyAgencyId = asOptionalUuid(body.agency_id)
        const agencyId = homepageAgencyId ?? bodyAgencyId

        if (!agencyId) {
            return NextResponse.json({ success: false, error: 'agency_required' }, { status: 400 })
        }

        const metadata =
            body.metadata && typeof body.metadata === 'object' && !Array.isArray(body.metadata)
                ? (body.metadata as Record<string, unknown>)
                : {}

        const supabase = await createServerSupabase()
        const { data, error } = await supabase.rpc('record_agency_event', {
            p_agency_id: agencyId,
            p_event_type: eventType,
            p_path: asOptionalString(body.path),
            p_entity_type: asOptionalString(body.entity_type),
            p_entity_id: asOptionalUuid(body.entity_id),
            p_session_id: asOptionalString(body.session_id),
            p_ip_address: resolveClientIp(request),
            p_user_agent: asOptionalString(request.headers.get('user-agent')),
            p_metadata: metadata,
        })

        if (error) {
            console.error('[api/events]', error.message)
            return NextResponse.json({ success: false, error: 'record_failed' }, { status: 500 })
        }

        return NextResponse.json(data ?? { success: true }, { status: 200 })
    } catch (error) {
        console.error('[api/events]', error)
        return NextResponse.json({ success: false, error: 'record_failed' }, { status: 500 })
    }
}
