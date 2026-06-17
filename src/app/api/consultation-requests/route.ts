import { createServerSupabase } from '@/lib/supabase/supabase.server'
import { MessageCode } from '@/lib/messages/codes'
import { consultationRequestsService } from '@/services/consultation-requests/consultation-requests.service'
import { createConsultationRequestSchema } from '@/services/consultation-requests/consultation-requests.schema'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    let body: unknown
    try {
        body = await request.json()
    } catch {
        return NextResponse.json({ code: MessageCode.VALIDATION_INVALID_PAYLOAD }, { status: 400 })
    }

    const parsed = createConsultationRequestSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({ code: MessageCode.VALIDATION_INVALID_PAYLOAD }, { status: 400 })
    }

    try {
        const supabase = await createServerSupabase()
        const consultationRequests = consultationRequestsService({ supabase })
        const result = await consultationRequests.submitConsultationRequest(parsed.data)

        return NextResponse.json(result, { status: 201 })
    } catch {
        return NextResponse.json(
            { code: MessageCode.API_CONTACT_SUBMIT_FAILED },
            { status: 500 },
        )
    }
}
