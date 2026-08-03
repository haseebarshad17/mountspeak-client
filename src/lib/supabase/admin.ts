import { createClient } from '@supabase/supabase-js'
import { clientEnv } from '@/env/client'
import { serverEnv } from '@/env/server'

export function createSupabaseAdminClient() {
    if (!serverEnv.SupabaseServiceRoleKey) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured')
    }

    return createClient(clientEnv.SupabaseURL, serverEnv.SupabaseServiceRoleKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    })
}
