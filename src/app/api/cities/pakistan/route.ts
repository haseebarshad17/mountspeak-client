import { NextResponse } from 'next/server'

import { fetchPakistanCities } from '@/services/cities/cities.service'

export async function GET() {
    const cities = await fetchPakistanCities()
    return NextResponse.json({ cities })
}
