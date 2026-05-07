// src/env/client.ts
import { z } from "zod";

const clientEnvSchema = z.object({
    // API_BASE_URL: z.string().url(),
});

export const clientEnv = clientEnvSchema.parse({
    // API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;