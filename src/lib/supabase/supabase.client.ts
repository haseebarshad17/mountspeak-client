import { clientEnv } from '@/env'
import { createBrowserClient } from '@supabase/ssr'

export function createClientSupabase() {
    return createBrowserClient(clientEnv.SupabaseURL, clientEnv.SupabaseKey)
}

/** Shared browser client — cookie-backed for SSR session refresh. */
export const supabase = createClientSupabase()
