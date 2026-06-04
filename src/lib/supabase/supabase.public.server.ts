import { createClient } from '@supabase/supabase-js'

import { serverEnv } from '@/env/server'

/** Server-side anon client for public reads (no cookies). Used for marketing homepage. */
export function createPublicSupabase() {
    return createClient(serverEnv.supabaseUrl, serverEnv.supabaseKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    })
}
