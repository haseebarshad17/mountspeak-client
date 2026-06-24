import { buildPlatformMetadata } from '@/assests/meta'
import type { AgencyHomepage } from '@/services/homepage/homepage.types'
import type { Metadata } from 'next'

import { getAgencyLayoutMetadata } from './homepage-meta'
import { getRequestSiteUrl } from './resolve-request-host'

type BuildPageMetadataOptions = {
    pageTitle: string
    description?: string
    homepage?: AgencyHomepage | null
}

export async function buildPageMetadata({
    pageTitle,
    description,
    homepage,
}: BuildPageMetadataOptions): Promise<Metadata> {
    if (homepage?.isAgencySite && homepage.siteUrl) {
        const agencyMeta = getAgencyLayoutMetadata(homepage)

        return {
            ...agencyMeta,
            title: pageTitle,
            ...(description ? { description } : {}),
            openGraph: {
                ...agencyMeta.openGraph,
                title: `${pageTitle} | ${homepage.page.branding.name}`,
                ...(description ? { description } : {}),
            },
            twitter: {
                ...agencyMeta.twitter,
                title: `${pageTitle} | ${homepage.page.branding.name}`,
                ...(description ? { description } : {}),
            },
        }
    }

    const platformMeta = buildPlatformMetadata(await getRequestSiteUrl())

    return {
        ...platformMeta,
        title: pageTitle,
        ...(description ? { description } : {}),
    }
}
