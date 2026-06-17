import { NextRequest, NextResponse } from 'next/server'

import {
    getHostnameFromHostHeader,
    isAgencyHostPathSegment,
    isAgencyPreviewPlatformHost,
} from '@/lib/homepage/agency-preview'
import { fetchAgencyHomepage, fetchAgencyHomepageForHost } from '@/services/homepage/homepage.server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const requestHostname = getHostnameFromHostHeader(request.headers.get('host'))
    const previewHost = request.nextUrl.searchParams.get('host')?.trim().toLowerCase()

    if (
        isAgencyPreviewPlatformHost(requestHostname) &&
        previewHost &&
        isAgencyHostPathSegment(previewHost)
    ) {
        const homepage = await fetchAgencyHomepageForHost(previewHost)
        return NextResponse.json(homepage)
    }

    const homepage = await fetchAgencyHomepage()
    return NextResponse.json(homepage)
}
