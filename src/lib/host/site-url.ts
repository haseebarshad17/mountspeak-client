function expandHostAliases(host: string): string[] {
    const aliases = new Set<string>([host])
    const [hostname, port] = host.split(':')

    if (hostname === '127.0.0.1' || hostname === '0.0.0.0') {
        aliases.add(port ? `localhost:${port}` : 'localhost')
    }

    if (hostname === 'localhost') {
        aliases.add(port ? `127.0.0.1:${port}` : '127.0.0.1')
    }

    return [...aliases]
}

/**
 * Builds `site_url` lookup candidates for agency_site_theme.site_url.
 * Always tries both with and without :3000/:3001 so local Host headers
 * still match production URLs like https://hamstours.mountspeak.com
 */
export function buildSiteUrlCandidates(requestHost: string): string[] {
    const candidates = new Set<string>()
    const normalized = normalizeAgencyHost(requestHost)

    for (const host of expandHostAliases(normalized)) {
        const [hostname, port] = host.split(':')
        const hostsToTry = new Set<string>([host, hostname])

        if (!port) {
            hostsToTry.add(`${hostname}:3000`)
            hostsToTry.add(`${hostname}:3001`)
        }

        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            hostsToTry.add('localhost:3000')
            hostsToTry.add('localhost:3001')
            hostsToTry.add('127.0.0.1:3000')
            hostsToTry.add('127.0.0.1:3001')
        }

        for (const hostValue of hostsToTry) {
            candidates.add(`http://${hostValue}`)
            candidates.add(`https://${hostValue}`)
        }
    }

    return [...candidates]
}

/** Strip protocol/path/trailing slash → hostname[:port] */
export function normalizeAgencyHost(value: string | null | undefined): string {
    const raw = (value ?? '').split(',')[0]?.trim().toLowerCase() ?? ''
    if (!raw) return 'localhost:3000'

    return raw
        .replace(/^https?:\/\//, '')
        .split('/')[0]
        .trim() || 'localhost:3000'
}

export function normalizeHost(hostHeader: string | null | undefined): string {
    return normalizeAgencyHost(hostHeader)
}

/** True when a path segment looks like an agency domain preview. */
export function isAgencyHostSegment(segment: string | null | undefined): boolean {
    if (!segment) return false
    const host = normalizeAgencyHost(segment)
    if (!host.includes('.')) return false
    if (host.startsWith('_next')) return false
    return true
}
