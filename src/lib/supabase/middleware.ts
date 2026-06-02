import { serverEnv } from '@/env'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(
    request: NextRequest
) {
    let response = NextResponse.next({ request })
    const pathname = request.nextUrl.pathname
    const protectedPaths = ['/dashboard', '/bookings']
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
        return NextResponse.redirect(loginUrl)
    }

    if (isProtectedPath && user) {
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