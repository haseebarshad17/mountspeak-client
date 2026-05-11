import { clientEnv } from '@/env'
import { createClient } from '@supabase/supabase-js'

export const createClientSupabase = createClient(
    clientEnv.supabaseUrl,
    clientEnv.supabaseKey!
)

export const supabase = createClientSupabase