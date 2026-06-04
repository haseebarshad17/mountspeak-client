import { createServerSupabase } from '@/lib/supabase/supabase.server'
import { consultationRequestsService } from '@/services/consultation-requests/consultation-requests.service'
import { createConsultationRequestSchema } from '@/services/consultation-requests/consultation-requests.schema'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    let body: unknown
    try {
        body = await request.json()
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
    }

    const parsed = createConsultationRequestSchema.safeParse(body)
    if (!parsed.success) {
        const firstIssue = parsed.error.issues[0]?.message ?? 'Invalid request payload.'
        return NextResponse.json({ error: firstIssue }, { status: 400 })
    }

    try {
        const supabase = await createServerSupabase()
        const consultationRequests = consultationRequestsService({ supabase })
        const result = await consultationRequests.submitConsultationRequest(parsed.data)

        return NextResponse.json(result, { status: 201 })
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : 'Unable to submit consultation request.'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
