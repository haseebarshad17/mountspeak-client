import { serverEnv } from '@/env/server'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(
    request: NextRequest
) {
    let response = NextResponse.next({ request })
    const pathname = request.nextUrl.pathname
    const protectedPaths = ['/dashboard', '/bookings', '/booking']
    const isProtectedPath = protectedPaths.some((path) =>
        pathname === path || pathname.startsWith(`${path}/`)
    )

    const supabase = createServerClient(
        serverEnv.supabaseUrl,
        serverEnv.supabaseKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },

                setAll(cookiesToSet) {
                    cookiesToSet.forEach(
                        ({ name, value }) =>
                            request.cookies.set(name, value)
                    )

                    response = NextResponse.next({ request })

                    cookiesToSet.forEach(
                        ({ name, value, options }) =>
                            response.cookies.set(
                                name,
                                value,
                                options
                            )
                    )
                },
            },
        }
    )

    const { data: authData } = await supabase.auth.getUser()
    const user = authData.user

    if (isProtectedPath && !user) {
        const loginUrl = request.nextUrl.clone()
        loginUrl.pathname = '/login'
        loginUrl.search = ''
        const returnPath = `${pathname}${request.nextUrl.search}`
        loginUrl.searchParams.set('next', returnPath)
        return NextResponse.redirect(loginUrl)
    }

    if (isProtectedPath && user) {
        if (!user.email_confirmed_at) {
            const verifyUrl = request.nextUrl.clone()
            verifyUrl.pathname = '/verify-email'
            verifyUrl.search = ''
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
            const loginUrl = request.nextUrl.clone()
            loginUrl.pathname = '/login'
            loginUrl.searchParams.set('error', 'role_not_allowed')
            return NextResponse.redirect(loginUrl)
        }
    }

    return response
}