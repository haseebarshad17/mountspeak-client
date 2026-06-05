import { createServerSupabase } from '@/lib/supabase/supabase.server'
import { sendTransactionalEmail } from '@/services/email/email.service'
import { sendTransactionalEmailSchema } from '@/services/email/email.schema'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    let body: unknown

    try {
        body = await request.json()
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
    }

    const parsed = sendTransactionalEmailSchema.safeParse(body)
    if (!parsed.success) {
        const firstIssue = parsed.error.issues[0]?.message ?? 'Invalid email payload.'
        return NextResponse.json({ error: firstIssue }, { status: 400 })
    }

    try {
        const supabase = await createServerSupabase()
        const { data: authData } = await supabase.auth.getUser()

        if (!authData.user) {
            return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
        }

        const result = await sendTransactionalEmail(parsed.data)

        return NextResponse.json(result, { status: 200 })
    } catch (error) {
        const message =
            error instanceof Error ? error.message : 'Unable to send email.'

        return NextResponse.json({ error: message }, { status: 500 })
    }
}
