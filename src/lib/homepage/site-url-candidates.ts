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

/** Builds `site_url` values for PostgREST `site_url=eq.*` (same as Supabase REST API). */
export function buildSiteUrlLookupCandidates(requestHost: string): string[] {
    const candidates = new Set<string>()

    const add = (url: string) => candidates.add(url)

    for (const host of expandHostAliases(requestHost.toLowerCase().trim())) {
        const [hostname, port] = host.split(':')
        const hostsToTry = new Set<string>([host])

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
            add(`http://${hostValue}`)
            add(`https://${hostValue}`)
            add(`http:${hostValue}`)
            add(`https://${hostValue}`)
        }
    }

    return [...candidates]
}
