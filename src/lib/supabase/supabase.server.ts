import { serverEnv } from '@/env'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerSupabase() {
    const cookieStore = await cookies()

    return createServerClient(
        serverEnv.supabaseUrl,
        serverEnv.supabaseKey,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    )
                },
            },
        }
    )
}

export const supabase = await createServerSupabase()