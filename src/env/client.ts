// src/env/client.ts
import { z } from "zod";

const clientEnvSchema = z.object({
    supabaseUrl: z.string().url(),
    supabaseKey: z.string().min(1),
});

export const clientEnv = clientEnvSchema.parse({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;