import { z } from 'zod'

const serverEnvSchema = z.object({
    EmailInternalSecret: z.string().optional(),
    SupabaseServiceRoleKey: z.string().optional(),
})

export const serverEnv = serverEnvSchema.parse({
    EmailInternalSecret: process.env.EMAIL_INTERNAL_SECRET,
    SupabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
})

export type ServerEnv = z.infer<typeof serverEnvSchema>
