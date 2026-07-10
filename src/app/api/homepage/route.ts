import { NextRequest, NextResponse } from 'next/server'

import {
    getHostnameFromHostHeader,
    isAgencyHostPathSegment,
    isAgencyPreviewPlatformHost,
} from '@/lib/homepage/agency-preview'
import { fetchAgencyHomepage, fetchAgencyHomepageForHost } from '@/services/homepage/homepage.server'

const cacheHeaders = {
    'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300',
}

export async function GET(request: NextRequest) {
    const requestHostname = getHostnameFromHostHeader(request.headers.get('host'))
    const previewHost = request.nextUrl.searchParams.get('host')?.trim().toLowerCase()

    if (
        isAgencyPreviewPlatformHost(requestHostname) &&
        previewHost &&
        isAgencyHostPathSegment(previewHost)
    ) {
        const homepage = await fetchAgencyHomepageForHost(previewHost)
        return NextResponse.json(homepage, { headers: cacheHeaders })
    }

    const homepage = await fetchAgencyHomepage()
    return NextResponse.json(homepage, { headers: cacheHeaders })
}
