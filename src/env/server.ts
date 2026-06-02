// src/env/server.ts
import { z } from "zod";

const serverEnvSchema = z.object({
    supabaseUrl: z.string().url(),
    supabaseKey: z.string().min(1),
});

export const serverEnv = serverEnvSchema.parse({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;