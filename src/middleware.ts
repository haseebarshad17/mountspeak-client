import {
    AGENCY_PREVIEW_HOST_COOKIE,
    getHostnameFromHostHeader,
    isLocalDevHostname,
    resolveAgencyPreviewFromPathname,
    type AgencyPreviewContext,
} from '@/lib/homepage/agency-preview'
import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse, NextRequest } from 'next/server'

function copyResponseCookies(from: NextResponse, to: NextResponse) {
    from.cookies.getAll().forEach(({ name, value, ...options }) => {
        to.cookies.set(name, value, options)
    })
}

function applyPreviewHostCookie(response: NextResponse, preview: AgencyPreviewContext | null) {
    if (preview) {
        response.cookies.set(AGENCY_PREVIEW_HOST_COOKIE, preview.agencyHost, {
            path: '/',
            sameSite: 'lax',
        })
        return
    }

    response.cookies.delete(AGENCY_PREVIEW_HOST_COOKIE)
}

function withAgencyHostHeader(request: NextRequest, agencyHost: string): Headers {
    const headers = new Headers(request.headers)
    headers.set('x-agency-site-host', agencyHost)
    return headers
}

function createPreviewRequestHeaders(
    request: NextRequest,
    preview: AgencyPreviewContext,
): Headers {
    const headers = new Headers(request.headers)
    headers.set('x-agency-site-host', preview.agencyHost)
    headers.set('x-agency-preview-base', preview.previewBase)
    return headers
}

async function handleLocalhostAgencyPreview(request: NextRequest): Promise<NextResponse> {
    const pathname = request.nextUrl.pathname
    const preview = resolveAgencyPreviewFromPathname(pathname)

    if (preview) {
        const requestHeaders = createPreviewRequestHeaders(request, preview)
        const internalRequest = new NextRequest(request.url, { headers: requestHeaders })

        const sessionResponse = await updateSession(internalRequest, {
            previewBase: preview.previewBase,
            browserRequest: request,
        })

        if (sessionResponse.status >= 300 && sessionResponse.status < 400) {
            applyPreviewHostCookie(sessionResponse, preview)
            return sessionResponse
        }

        const response = NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        })

        copyResponseCookies(sessionResponse, response)
        applyPreviewHostCookie(response, preview)
        return response
    }

    const cookiePreviewHost = request.cookies.get(AGENCY_PREVIEW_HOST_COOKIE)?.value

    if (pathname.startsWith('/api/') && cookiePreviewHost) {
        const apiHeaders = withAgencyHostHeader(request, cookiePreviewHost)
        const apiRequest = new NextRequest(request.url, { headers: apiHeaders })
        const sessionResponse = await updateSession(apiRequest)
        const nextResponse = NextResponse.next({
            request: {
                headers: apiHeaders,
            },
        })
        copyResponseCookies(sessionResponse, nextResponse)
        return nextResponse
    }

    const sessionResponse = await updateSession(request)
    applyPreviewHostCookie(sessionResponse, null)
    return sessionResponse
}

export async function middleware(request: NextRequest) {
    const hostname = getHostnameFromHostHeader(request.headers.get('host'))

    if (isLocalDevHostname(hostname)) {
        return handleLocalhostAgencyPreview(request)
    }

    return updateSession(request)
}

export const config = {
    matcher: [
        // Next.js skips middleware on dotted path segments by default (treated as static files).
        '/(.*\\.vercel\\.app)',
        '/(.*\\.vercel\\.app)/:path*',
        { source: '/:path*', has: [{ type: 'host', value: 'localhost:3000' }] },
        { source: '/:path*', has: [{ type: 'host', value: 'localhost:3001' }] },
        { source: '/:path*', has: [{ type: 'host', value: '127.0.0.1:3000' }] },
        { source: '/:path*', has: [{ type: 'host', value: '127.0.0.1:3001' }] },
    ],
}
