import { NextRequest, NextResponse } from 'next/server'
import { AGENCY_PREVIEW_HOST_COOKIE } from '@/lib/host/preview-host'
import { isAgencyHostSegment, normalizeAgencyHost } from '@/lib/host/site-url'
import { normalizeAuthRedirectPath } from '@/lib/auth/auth-urls'
import { createServerAuthSupabase } from '@/lib/supabase/supabase.server'
import { completeAgencySiteAuth } from '@/services/auth/auth.service'
import { isValidAgencyId } from '@/services/specialization/specialization.service'

function withHost(path: string, host: string | null) {
    const url = new URL(path, 'http://localhost')
    if (host && isAgencyHostSegment(host)) {
        url.searchParams.set('host', normalizeAgencyHost(host))
    }
    return `${url.pathname}${url.search}`
}

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const providerError = requestUrl.searchParams.get('error')
    const nextPath = normalizeAuthRedirectPath(requestUrl.searchParams.get('next'))
    const queryAgencyId = requestUrl.searchParams.get('agency_id')
    const queryHost = requestUrl.searchParams.get('host')
    const cookieHost = request.cookies.get(AGENCY_PREVIEW_HOST_COOKIE)?.value ?? null
    const host = queryHost || cookieHost

    const loginPath = withHost('/login', host)

    if (providerError) {
        const url = new URL(loginPath, requestUrl.origin)
        url.searchParams.set('error', 'oauth_failed')
        return NextResponse.redirect(url)
    }

    if (!code) {
        const url = new URL(loginPath, requestUrl.origin)
        url.searchParams.set('error', 'oauth_failed')
        return NextResponse.redirect(url)
    }

    const supabase = await createServerAuthSupabase()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
        const url = new URL(loginPath, requestUrl.origin)
        url.searchParams.set('error', 'oauth_failed')
        return NextResponse.redirect(url)
    }

    if (isValidAgencyId(queryAgencyId)) {
        try {
            await completeAgencySiteAuth(supabase, queryAgencyId!)
        } catch {
            await supabase.auth.signOut()
            const url = new URL(loginPath, requestUrl.origin)
            url.searchParams.set('error', 'customer_site_access_denied')
            return NextResponse.redirect(url)
        }
    }

    const destination = new URL(withHost(nextPath, host), requestUrl.origin)
    return NextResponse.redirect(destination)
}
