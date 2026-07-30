import { clientEnv } from '@/env'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

/**
 * Anonymous / public data client (no cookie session).
 * Prefer this for CMS + listings fetches.
 */
export function createServerSupabase() {
    return createClient(clientEnv.SupabaseURL, clientEnv.SupabaseKey!, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
        },
        global: {
            fetch: (url, options = {}) =>
                fetch(url, {
                    ...options,
                    cache: 'no-store',
                }),
        },
    })
}

/** Cookie-aware client for auth callback / server session reads. */
export async function createServerAuthSupabase() {
    const cookieStore = await cookies()

    return createServerClient(clientEnv.SupabaseURL, clientEnv.SupabaseKey!, {
        cookies: {
            getAll() {
                return cookieStore.getAll()
            },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    )
                } catch {
                    // Called from a Server Component — middleware will refresh sessions.
                }
            },
        },
    })
}
