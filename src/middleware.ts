import { NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import {
    AGENCY_PREVIEW_HOST_COOKIE,
    AGENCY_PREVIEW_HOST_HEADER,
} from '@/lib/host/preview-host'
import { isAgencyHostSegment, normalizeAgencyHost } from '@/lib/host/site-url'

function withAgencyHostHeader(request: NextRequest, agencyHost: string) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set(AGENCY_PREVIEW_HOST_HEADER, agencyHost)
    return requestHeaders
}

function copyCookies(from: NextResponse, to: NextResponse) {
    from.cookies.getAll().forEach(({ name, value, ...options }) => {
        to.cookies.set(name, value, options)
    })
}

function setPreviewHostCookie(response: NextResponse, agencyHost: string) {
    response.cookies.set(AGENCY_PREVIEW_HOST_COOKIE, agencyHost, {
        path: '/',
        sameSite: 'lax',
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 7,
    })
}

async function continueWithAgencyHost(request: NextRequest, agencyHost: string) {
    const requestHeaders = withAgencyHostHeader(request, agencyHost)
    const sessionRequest = new NextRequest(request.url, { headers: requestHeaders })
    const sessionResponse = await updateSession(sessionRequest)
    const response = NextResponse.next({ request: { headers: requestHeaders } })
    copyCookies(sessionResponse, response)
    setPreviewHostCookie(response, agencyHost)
    return response
}

/**
 * Local / platform preview:
 * - http://localhost:3000/?host=hamstours.mountspeak.com
 * - http://localhost:3000/hamstours.mountspeak.com
 * - http://localhost:3000/hamstours.mountspeak.com/about-us
 *
 * When `?host=` is present it is stored in a cookie. Later navigations
 * without the query are redirected back with `?host=` so preview persists.
 *
 * Note: use http (not https) for local Next.js.
 */
export async function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl

    const queryHost = searchParams.get('host')?.trim()
    if (queryHost && isAgencyHostSegment(queryHost)) {
        return continueWithAgencyHost(request, normalizeAgencyHost(queryHost))
    }

    const firstSegment = pathname.split('/').filter(Boolean)[0] ?? ''
    if (isAgencyHostSegment(firstSegment)) {
        const agencyHost = normalizeAgencyHost(firstSegment)
        const rest = pathname.slice(`/${firstSegment}`.length) || '/'
        const rewriteUrl = request.nextUrl.clone()
        rewriteUrl.pathname = rest

        const requestHeaders = withAgencyHostHeader(request, agencyHost)
        const sessionRequest = new NextRequest(request.url, { headers: requestHeaders })
        const sessionResponse = await updateSession(sessionRequest)

        const response = NextResponse.rewrite(rewriteUrl, {
            request: { headers: requestHeaders },
        })
        copyCookies(sessionResponse, response)
        setPreviewHostCookie(response, agencyHost)
        return response
    }

    const cookieHost = request.cookies.get(AGENCY_PREVIEW_HOST_COOKIE)?.value?.trim()
    if (cookieHost && isAgencyHostSegment(cookieHost)) {
        const agencyHost = normalizeAgencyHost(cookieHost)
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.searchParams.set('host', agencyHost)
        const response = NextResponse.redirect(redirectUrl)
        setPreviewHostCookie(response, agencyHost)
        return response
    }

    return updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Next skips middleware on dotted path segments by default (static files).
         * Explicit dotted matchers restore /hamstours.mountspeak.com preview.
         */
        '/([^/]+\\.[^/]+)',
        '/([^/]+\\.[^/]+)/:path*',
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
