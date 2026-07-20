import type { NextRequest } from 'next/server'

/** Best-effort client IP from common proxy / CDN headers. */
export function resolveClientIp(request: NextRequest): string | null {
    const candidates = [
        request.headers.get('cf-connecting-ip'),
        request.headers.get('true-client-ip'),
        request.headers.get('x-real-ip'),
        request.headers.get('x-forwarded-for')?.split(',')[0],
    ]

    for (const candidate of candidates) {
        const trimmed = candidate?.trim()
        if (trimmed) return trimmed
    }

    return null
}
