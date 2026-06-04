import { normalizeSiteUrl } from '@/services/homepage/homepage.mapper'

function hostFromSiteUrl(siteUrl: string | null | undefined): string | null {
    const origin = normalizeSiteUrl(siteUrl)
    if (!origin) return null

    try {
        return new URL(origin).host.toLowerCase()
    } catch {
        return null
    }
}

function stripWww(host: string): string {
    return host.replace(/^www\./, '')
}

/** True when `agency_sites.site_url` matches the incoming request host. */
export function agencySiteUrlMatchesHost(
    siteUrl: string | null | undefined,
    requestHost: string,
): boolean {
    const storedHost = hostFromSiteUrl(siteUrl)
    if (!storedHost) return false

    const request = requestHost.toLowerCase()

    if (storedHost === request) return true
    if (stripWww(storedHost) === stripWww(request)) return true

    return false
}
