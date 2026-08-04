import { NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import {
    AGENCY_PREVIEW_HOST_COOKIE,
    AGENCY_PREVIEW_HOST_HEADER,
} from '@/lib/host/preview-host'
import { isAgencyHostSegment, normalizeAgencyHost } from '@/lib/host/site-url'
import {
    AGENCY_PREVIEW_TEMPLATE_COOKIE,
    AGENCY_PREVIEW_TEMPLATE_HEADER,
    TEMPLATE_ID_QUERY_PARAM,
    normalizePreviewTemplateId,
} from '@/lib/templates/preview-template'

function withPreviewHeaders(
    request: NextRequest,
    opts: { agencyHost?: string; templateId?: string | null }
) {
    const requestHeaders = new Headers(request.headers)
    if (opts.agencyHost) {
        requestHeaders.set(AGENCY_PREVIEW_HOST_HEADER, opts.agencyHost)
    }
    if (opts.templateId) {
        requestHeaders.set(AGENCY_PREVIEW_TEMPLATE_HEADER, opts.templateId)
    }
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

function setPreviewTemplateCookie(response: NextResponse, templateId: string) {
    // Session cookie — preview override ends when the browser session ends.
    response.cookies.set(AGENCY_PREVIEW_TEMPLATE_COOKIE, templateId, {
        path: '/',
        sameSite: 'lax',
        httpOnly: false,
    })
}

function clearPreviewTemplateCookie(response: NextResponse) {
    response.cookies.set(AGENCY_PREVIEW_TEMPLATE_COOKIE, '', {
        path: '/',
        maxAge: 0,
    })
}

async function continueWithPreview(
    request: NextRequest,
    opts: { agencyHost?: string; templateId?: string | null }
) {
    const requestHeaders = withPreviewHeaders(request, opts)
    const sessionRequest = new NextRequest(request.url, { headers: requestHeaders })
    const sessionResponse = await updateSession(sessionRequest)
    const response = NextResponse.next({ request: { headers: requestHeaders } })
    copyCookies(sessionResponse, response)
    if (opts.agencyHost) setPreviewHostCookie(response, opts.agencyHost)
    if (opts.templateId) setPreviewTemplateCookie(response, opts.templateId)
    return response
}

/**
 * Local / platform preview:
 * - http://localhost:3000/?host=hamstours.mountspeak.com
 * - http://localhost:3000/?templateId=ab12-cd34-ef
 * - http://localhost:3000/hamstours.mountspeak.com
 * - http://localhost:3000/hamstours.mountspeak.com/about-us
 *
 * `?host=` and `?templateId=` are stored in cookies. Later navigations without
 * those query params are redirected so preview stays in the URL.
 *
 * Note: use http (not https) for local Next.js.
 */
export async function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl

    const queryTemplateId = normalizePreviewTemplateId(
        searchParams.get(TEMPLATE_ID_QUERY_PARAM)
    )
    const cookieTemplateId = normalizePreviewTemplateId(
        request.cookies.get(AGENCY_PREVIEW_TEMPLATE_COOKIE)?.value
    )

    // Persist template preview in the URL across route changes (pages only).
    if (
        !queryTemplateId &&
        cookieTemplateId &&
        !pathname.startsWith('/api/') &&
        !pathname.startsWith('/auth/')
    ) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.searchParams.set(TEMPLATE_ID_QUERY_PARAM, cookieTemplateId)
        const response = NextResponse.redirect(redirectUrl)
        setPreviewTemplateCookie(response, cookieTemplateId)
        return response
    }

    const queryHost = searchParams.get('host')?.trim()
    if (queryHost && isAgencyHostSegment(queryHost)) {
        return continueWithPreview(request, {
            agencyHost: normalizeAgencyHost(queryHost),
            templateId: queryTemplateId,
        })
    }

    const firstSegment = pathname.split('/').filter(Boolean)[0] ?? ''
    if (isAgencyHostSegment(firstSegment)) {
        const agencyHost = normalizeAgencyHost(firstSegment)
        const rest = pathname.slice(`/${firstSegment}`.length) || '/'
        const rewriteUrl = request.nextUrl.clone()
        rewriteUrl.pathname = rest

        const requestHeaders = withPreviewHeaders(request, {
            agencyHost,
            templateId: queryTemplateId,
        })
        const sessionRequest = new NextRequest(request.url, { headers: requestHeaders })
        const sessionResponse = await updateSession(sessionRequest)

        const response = NextResponse.rewrite(rewriteUrl, {
            request: { headers: requestHeaders },
        })
        copyCookies(sessionResponse, response)
        setPreviewHostCookie(response, agencyHost)
        if (queryTemplateId) setPreviewTemplateCookie(response, queryTemplateId)
        return response
    }

    if (queryTemplateId) {
        return continueWithPreview(request, { templateId: queryTemplateId })
    }

    const sessionResponse = await updateSession(request)

    // API / auth routes should not wipe an active template preview session.
    if (pathname.startsWith('/api/') || pathname.startsWith('/auth/')) {
        return sessionResponse
    }

    // Do not auto-restore agency host preview from cookie. Bare localhost must show
    // the default Template 1 (Classic). Preview only via ?host= or /agency.host/.
    if (request.cookies.has(AGENCY_PREVIEW_HOST_COOKIE)) {
        sessionResponse.cookies.set(AGENCY_PREVIEW_HOST_COOKIE, '', {
            path: '/',
            maxAge: 0,
        })
    }
    if (request.cookies.has(AGENCY_PREVIEW_TEMPLATE_COOKIE)) {
        clearPreviewTemplateCookie(sessionResponse)
    }
    return sessionResponse
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
