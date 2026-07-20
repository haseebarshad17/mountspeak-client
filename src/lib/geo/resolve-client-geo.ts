import type { NextRequest } from 'next/server'

export type ClientGeo = {
    city: string | null
    region: string | null
    country: string | null
}

function asGeoString(value: string | null | undefined): string | null {
    const trimmed = value?.trim()
    return trimmed || null
}

function isPrivateOrLocalIp(ip: string): boolean {
    const normalized = ip.trim().toLowerCase()

    if (
        normalized === '::1' ||
        normalized === '127.0.0.1' ||
        normalized === '::ffff:127.0.0.1' ||
        normalized === ':ffff:127.0.0.1'
    ) {
        return true
    }

    if (normalized.startsWith('10.') || normalized.startsWith('192.168.')) {
        return true
    }

    if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(normalized)) {
        return true
    }

    return false
}

function geoFromRequestHeaders(request: NextRequest): ClientGeo | null {
    const city =
        asGeoString(request.headers.get('x-vercel-ip-city')) ??
        asGeoString(request.headers.get('cf-ipcity'))

    const region =
        asGeoString(request.headers.get('x-vercel-ip-country-region')) ??
        asGeoString(request.headers.get('cf-region'))

    const country =
        asGeoString(request.headers.get('x-vercel-ip-country')) ??
        asGeoString(request.headers.get('cf-ipcountry'))

    if (!city && !region && !country) {
        return null
    }

    return { city, region, country }
}

async function geoFromIpLookup(ip: string): Promise<ClientGeo | null> {
    try {
        const response = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, {
            headers: { Accept: 'application/json', 'User-Agent': 'mountspeak-analytics/1.0' },
            signal: AbortSignal.timeout(2500),
            next: { revalidate: 60 * 60 * 24 },
        })

        if (!response.ok) return null

        const payload = (await response.json()) as {
            city?: unknown
            region?: unknown
            country_code?: unknown
            error?: unknown
        }

        if (payload.error) return null

        return {
            city: typeof payload.city === 'string' ? payload.city : null,
            region: typeof payload.region === 'string' ? payload.region : null,
            country: typeof payload.country_code === 'string' ? payload.country_code : null,
        }
    } catch {
        return null
    }
}

export async function resolveClientGeo(
    request: NextRequest,
    ip: string | null,
): Promise<ClientGeo | null> {
    const fromHeaders = geoFromRequestHeaders(request)
    if (fromHeaders) return fromHeaders

    if (!ip || isPrivateOrLocalIp(ip)) {
        return null
    }

    return geoFromIpLookup(ip)
}

export function mergeGeoIntoMetadata(
    metadata: Record<string, unknown>,
    geo: ClientGeo | null,
): Record<string, unknown> {
    if (!geo || (!geo.city && !geo.region && !geo.country)) {
        return metadata
    }

    return {
        ...metadata,
        ...(geo.city ? { city: geo.city } : {}),
        ...(geo.region ? { region: geo.region } : {}),
        ...(geo.country ? { country: geo.country } : {}),
    }
}
