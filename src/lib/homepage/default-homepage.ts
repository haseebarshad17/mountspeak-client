import homepageDefaultsDocument from '@/data/homepage-defaults.json'
import type { HomepagePage } from '@/data/homepage'
import { normalizeHomepagePage } from '@/lib/homepage/normalize-homepage'
import { buildSiteUrlLookupCandidates } from '@/lib/homepage/site-url-candidates'
import { resolveStorageUrlsDeep } from '@/lib/supabase/resolve-storage-urls'
import { normalizeSiteUrl } from '@/services/homepage/homepage.mapper'
import type { AgencyHomepage } from '@/services/homepage/homepage.types'

export const DEFAULT_AGENCY_ID = '00000000-0000-0000-0000-000000000000'

export const DUMMY_HOMEPAGE_PAGE = normalizeHomepagePage(
    homepageDefaultsDocument.page as HomepagePage,
)

function resolveFallbackSiteUrl(requestHost: string): string {
    const candidates = buildSiteUrlLookupCandidates(requestHost)
    const https = candidates.find((url) => url.startsWith('https://'))
    if (https) return normalizeSiteUrl(https) ?? https

    const http = candidates.find((url) => url.startsWith('http://'))
    if (http) return normalizeSiteUrl(http) ?? http

    return `https://${requestHost}`
}

export function createDefaultAgencyHomepage(requestHost: string): AgencyHomepage {
    const page = normalizeHomepagePage(structuredClone(homepageDefaultsDocument.page) as HomepagePage)

    return {
        agencyId: DEFAULT_AGENCY_ID,
        siteUrl: resolveFallbackSiteUrl(requestHost),
        specializationId: null,
        specializations: [],
        isAgencySite: false,
        themeUpdatedAt: null,
        page: resolveStorageUrlsDeep(page),
    }
}
