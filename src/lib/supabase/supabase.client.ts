import { clientEnv } from '@/env'
import { createBrowserClient } from '@supabase/ssr'

export const createClientSupabase = createBrowserClient(
    clientEnv.supabaseUrl,
    clientEnv.supabaseKey!
)

export const supabase = createClientSupabase