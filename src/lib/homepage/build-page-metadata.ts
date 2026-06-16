import { defaultMeta } from '@/assests/meta'
import type { AgencyHomepage } from '@/services/homepage/homepage.types'
import type { Metadata } from 'next'

import { getAgencyLayoutMetadata } from './homepage-meta'

type BuildPageMetadataOptions = {
    pageTitle: string
    description?: string
    homepage?: AgencyHomepage | null
}

export function buildPageMetadata({
    pageTitle,
    description,
    homepage,
}: BuildPageMetadataOptions): Metadata {
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

    return {
        ...defaultMeta,
        title: pageTitle,
        ...(description ? { description } : {}),
    }
}
