// src/env/server.ts
import { z } from "zod";

const serverEnvSchema = z.object({
    // MONGODB_URI: z.string().url(),
});

export const serverEnv = serverEnvSchema.parse({
    // MONGODB_URI: process.env.MONGODB_URI,
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;