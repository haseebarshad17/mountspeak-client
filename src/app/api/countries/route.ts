import { NextResponse } from 'next/server'

import { fetchCountries } from '@/services/cities/cities.service'

export async function GET() {
    const countries = await fetchCountries()
    return NextResponse.json({ countries })
}
