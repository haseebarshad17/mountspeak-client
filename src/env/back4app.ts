import { z } from 'zod'

const back4appEnvSchema = z.object({
    back4appApplicationId: z.string().min(1),
    back4appMasterKey: z.string().min(1),
})

export type Back4AppEnv = z.infer<typeof back4appEnvSchema>

/** Parsed on demand so client bundles never require these server-only env vars. */
export function getBack4AppEnv(): Back4AppEnv {
    return back4appEnvSchema.parse({
        back4appApplicationId: process.env.BACK4APP_APPLICATION_ID,
        back4appMasterKey: process.env.BACK4APP_MASTER_KEY,
    })
}
