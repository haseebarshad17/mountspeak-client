import { headers } from 'next/headers'

import { HomepageLoadError } from '@/services/homepage/homepage.errors'

/** Current request host, e.g. `localhost:3000` or `agency.example.com`. */
export async function getRequestSiteHost(): Promise<string> {
    const headersList = await headers()
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

    return raw.toLowerCase()
}
