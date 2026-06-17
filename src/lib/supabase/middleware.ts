import { serverEnv } from '@/env/server'
import { prefixHref } from '@/lib/homepage/agency-preview'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

type UpdateSessionOptions = {
    previewBase?: string | null
    browserRequest?: NextRequest
}

function buildRedirectUrl(
    request: NextRequest,
    browserRequest: NextRequest | undefined,
    previewBase: string | null | undefined,
    internalPathname: string,
): URL {
    const url = (browserRequest ?? request).nextUrl.clone()
    url.pathname = prefixHref(internalPathname, previewBase)
    url.search = ''
    return url
}

export async function updateSession(request: NextRequest, options: UpdateSessionOptions = {}) {
    const { previewBase = null, browserRequest } = options
    let response = NextResponse.next({ request })
    const pathname = request.nextUrl.pathname
    const protectedPaths = ['/dashboard', '/bookings', '/booking']
    const guestOnlyPaths = ['/login', '/register']
    const isProtectedPath = protectedPaths.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`),
    )
    const isGuestOnlyPath = guestOnlyPaths.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`),
    )

    const supabase = createServerClient(serverEnv.supabaseUrl, serverEnv.supabaseKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll()
            },

            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))

                response = NextResponse.next({ request })

                cookiesToSet.forEach(({ name, value, options: cookieOptions }) =>
                    response.cookies.set(name, value, cookieOptions),
                )
            },
        },
    })

    const { data: authData } = await supabase.auth.getUser()
    const user = authData.user

    const copyCookies = (target: NextResponse) => {
        response.cookies.getAll().forEach(({ name, value, ...cookieOptions }) => {
            target.cookies.set(name, value, cookieOptions)
        })
    }

    if (isGuestOnlyPath && user) {
        const redirectResponse = NextResponse.redirect(
            buildRedirectUrl(request, browserRequest, previewBase, '/'),
        )
        copyCookies(redirectResponse)
        return redirectResponse
    }

    if (isProtectedPath && !user) {
        const loginUrl = buildRedirectUrl(request, browserRequest, previewBase, '/login')
        const returnPath = `${pathname}${request.nextUrl.search}`
        loginUrl.searchParams.set('next', returnPath)
        return NextResponse.redirect(loginUrl)
    }

    if (isProtectedPath && user) {
        if (!user.email_confirmed_at) {
            const verifyUrl = buildRedirectUrl(request, browserRequest, previewBase, '/verify-email')
            if (user.email) {
                verifyUrl.searchParams.set('email', user.email)
            }
            return NextResponse.redirect(verifyUrl)
        }

        const { data: profile } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role !== 'CLIENT') {
            await supabase.auth.signOut()
            const loginUrl = buildRedirectUrl(request, browserRequest, previewBase, '/login')
            loginUrl.searchParams.set('error', 'role_not_allowed')
            return NextResponse.redirect(loginUrl)
        }
    }

    return response
}
