import { NextResponse } from 'next/server'

import { HomepageLoadError } from '@/services/homepage/homepage.errors'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const homepage = await fetchAgencyHomepage()
        return NextResponse.json(homepage)
    } catch (error) {
        if (error instanceof HomepageLoadError) {
            return NextResponse.json(
                { error: error.message, code: error.code },
                { status: error.status },
            )
        }

        const message = error instanceof Error ? error.message : 'Failed to load homepage'
        return NextResponse.json({ error: message, code: 'SUPABASE_ERROR' }, { status: 500 })
    }
}
