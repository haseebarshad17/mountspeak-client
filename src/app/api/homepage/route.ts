import { NextResponse } from 'next/server'

import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'

export const dynamic = 'force-dynamic'

export async function GET() {
    const homepage = await fetchAgencyHomepage()
    return NextResponse.json(homepage)
}
