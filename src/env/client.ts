import { z } from 'zod'

const clientEnvSchema = z.object({
    SupabaseURL: z.string().url(),
    SupabaseKey: z.string().min(1),
})

const parsed = clientEnvSchema.parse({
    SupabaseURL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SupabaseKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
})

export const clientEnv = {
    ...parsed,
    /** @deprecated use SupabaseURL */
    supabaseUrl: parsed.SupabaseURL,
    /** @deprecated use SupabaseKey */
    supabaseKey: parsed.SupabaseKey,
}

export type ClientEnv = typeof clientEnv
