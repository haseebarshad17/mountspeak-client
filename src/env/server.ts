// src/env/server.ts
import { z } from "zod";

const serverEnvSchema = z.object({
    supabaseUrl: z.string().url(),
    supabaseKey: z.string().min(1),
    siteUrl: z.string().url().optional(),
    emailInternalSecret: z.string().min(1).optional(),
});

export const serverEnv = serverEnvSchema.parse({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    emailInternalSecret: process.env.EMAIL_INTERNAL_SECRET,
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;