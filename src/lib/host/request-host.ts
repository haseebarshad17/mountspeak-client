import { headers } from 'next/headers'
import { AGENCY_PREVIEW_HOST_HEADER } from './preview-host'
import { normalizeAgencyHost } from './site-url'

export async function getRequestHost(): Promise<string> {
    const h = await headers()
    const previewHost = h.get(AGENCY_PREVIEW_HOST_HEADER)
    if (previewHost?.trim()) return normalizeAgencyHost(previewHost)
    return normalizeAgencyHost(h.get('host'))
}
