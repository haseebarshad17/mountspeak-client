import { NextRequest, NextResponse } from 'next/server'
import { AGENCY_PREVIEW_HOST_COOKIE } from '@/lib/host/preview-host'
import { isAgencyHostSegment, normalizeAgencyHost } from '@/lib/host/site-url'
import { normalizeAuthRedirectPath } from '@/lib/auth/auth-urls'
import {
    TEMPLATE_ID_QUERY_PARAM,
    normalizePreviewTemplateId,
} from '@/lib/templates/preview-template'
import { createServerAuthSupabase } from '@/lib/supabase/supabase.server'
import { completeAgencySiteAuth } from '@/services/auth/auth.service'
import { isValidAgencyId } from '@/services/specialization/specialization.service'

function withPreviewParams(
    path: string,
    opts: { host: string | null; templateId: string | null }
) {
    const url = new URL(path, 'http://localhost')
    if (opts.host && isAgencyHostSegment(opts.host)) {
        url.searchParams.set('host', normalizeAgencyHost(opts.host))
    }
    if (opts.templateId) {
        url.searchParams.set(TEMPLATE_ID_QUERY_PARAM, opts.templateId)
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
    const templateId = normalizePreviewTemplateId(
        requestUrl.searchParams.get(TEMPLATE_ID_QUERY_PARAM)
    )

    const loginPath = withPreviewParams('/login', { host, templateId })

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

    const destination = new URL(
        withPreviewParams(nextPath, { host, templateId }),
        requestUrl.origin
    )
    return NextResponse.redirect(destination)
}
