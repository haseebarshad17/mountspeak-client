import type { NextRequest } from 'next/server'

import { resolveClientIp } from './resolve-client-ip'

export type ClientGeo = {
    city: string | null
    region: string | null
    country: string | null
}

function decodeGeoHeader(value: string | null | undefined): string | null {
    const trimmed = value?.trim()
    if (!trimmed) return null

    try {
        return decodeURIComponent(trimmed.replace(/\+/g, ' ')).trim() || null
    } catch {
        return trimmed
    }
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
        decodeGeoHeader(request.headers.get('x-vercel-ip-city')) ??
        decodeGeoHeader(request.headers.get('cf-ipcity'))

    const region =
        decodeGeoHeader(request.headers.get('x-vercel-ip-country-region')) ??
        decodeGeoHeader(request.headers.get('cf-region'))

    const country =
        decodeGeoHeader(request.headers.get('x-vercel-ip-country')) ??
        decodeGeoHeader(request.headers.get('cf-ipcountry'))

    if (!city && !region && !country) {
        return null
    }

    return { city, region, country }
}

type GeoLookupPayload = {
    city?: unknown
    region?: unknown
    country?: unknown
    country_code?: unknown
    success?: unknown
    error?: unknown
}

function normalizeGeoPayload(payload: GeoLookupPayload): ClientGeo | null {
    if (payload.success === false || payload.error) {
        return null
    }

    const city = typeof payload.city === 'string' ? payload.city.trim() : null
    const region = typeof payload.region === 'string' ? payload.region.trim() : null
    const countryRaw =
        typeof payload.country_code === 'string'
            ? payload.country_code.trim()
            : typeof payload.country === 'string'
              ? payload.country.trim()
              : null

    if (!city && !region && !countryRaw) {
        return null
    }

    return { city, region, country: countryRaw }
}

async function fetchGeoLookup(url: string): Promise<ClientGeo | null> {
    try {
        const response = await fetch(url, {
            headers: { Accept: 'application/json', 'User-Agent': 'mountspeak-analytics/1.0' },
            signal: AbortSignal.timeout(3000),
            cache: 'no-store',
        })

        if (!response.ok) return null

        const payload = (await response.json()) as GeoLookupPayload
        return normalizeGeoPayload(payload)
    } catch {
        return null
    }
}

async function geoFromIpLookup(ip: string): Promise<ClientGeo | null> {
    const encodedIp = encodeURIComponent(ip)

    const providers = [
        `https://ipwho.is/${encodedIp}`,
        `https://ipapi.co/${encodedIp}/json/`,
    ]

    for (const url of providers) {
        const geo = await fetchGeoLookup(url)
        if (geo) return geo
    }

    return null
}

export async function resolveClientGeo(
    request: NextRequest,
    ip: string | null = resolveClientIp(request),
): Promise<ClientGeo | null> {
    const fromHeaders = geoFromRequestHeaders(request)
    if (fromHeaders?.city || fromHeaders?.country) {
        return fromHeaders
    }

    if (!ip || isPrivateOrLocalIp(ip)) {
        return fromHeaders
    }

    const fromLookup = await geoFromIpLookup(ip)
    if (fromLookup) {
        return {
            city: fromLookup.city ?? fromHeaders?.city ?? null,
            region: fromLookup.region ?? fromHeaders?.region ?? null,
            country: fromLookup.country ?? fromHeaders?.country ?? null,
        }
    }

    return fromHeaders
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
