import { createServerSupabase } from '@/lib/supabase/supabase.server'
import { MessageCode } from '@/lib/messages/codes'
import { sendTransactionalEmail } from '@/services/email/email.service'
import { sendTransactionalEmailSchema } from '@/services/email/email.schema'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    let body: unknown

    try {
        body = await request.json()
    } catch {
        return NextResponse.json({ code: MessageCode.VALIDATION_INVALID_PAYLOAD }, { status: 400 })
    }

    const parsed = sendTransactionalEmailSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({ code: MessageCode.VALIDATION_INVALID_PAYLOAD }, { status: 400 })
    }

    try {
        const supabase = await createServerSupabase()
        const { data: authData } = await supabase.auth.getUser()

        if (!authData.user) {
            return NextResponse.json({ code: MessageCode.API_GENERIC }, { status: 401 })
        }

        const result = await sendTransactionalEmail(parsed.data)

        return NextResponse.json(result, { status: 200 })
    } catch {
        return NextResponse.json({ code: MessageCode.API_EMAIL_SEND_FAILED }, { status: 500 })
    }
}
