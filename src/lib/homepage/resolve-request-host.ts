import { headers } from 'next/headers'

import {
    getHostnameFromHostHeader,
    isAgencyPreviewPlatformHost,
} from '@/lib/homepage/agency-preview'
import { readAgencyPreviewHostForRequest } from '@/lib/homepage/agency-preview-request'
import { normalizeSiteUrl } from '@/lib/utils/site-url'
import { HomepageLoadError } from '@/services/homepage/homepage.errors'

export async function getRequestSiteHost(): Promise<string> {
    const headersList = await headers()
    const overrideHost = headersList.get('x-agency-site-host')?.trim().toLowerCase()

    if (overrideHost) {
        return overrideHost
    }

    const raw =
        headersList.get('x-forwarded-host')?.split(',')[0]?.trim() ||
        headersList.get('host')?.trim() ||
        ''

    if (!raw) {
        throw new HomepageLoadError(
            'Could not resolve the request host. Ensure the site is accessed via HTTP with a Host header.',
            'SITE_HOST_MISSING',
            400,
        )
    }

    const hostname = getHostnameFromHostHeader(raw)

    if (isAgencyPreviewPlatformHost(hostname)) {
        const requestPreviewHost = readAgencyPreviewHostForRequest()
        if (requestPreviewHost) {
            return requestPreviewHost
        }
    }

    return raw.toLowerCase()
}

export async function getRequestSiteUrl(): Promise<string> {
    const headersList = await headers()
    const host = await getRequestSiteHost()
    const proto =
        headersList.get('x-forwarded-proto')?.split(',')[0]?.trim() || 'https'
    return normalizeSiteUrl(`${proto}://${host}`)
}
