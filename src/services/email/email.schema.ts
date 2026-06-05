import { z } from 'zod'

export const sendTransactionalEmailSchema = z.object({
    event_type: z.string().trim().min(1),
    to_email: z.string().trim().email(),
    to_name: z.string().trim().max(120).optional().nullable(),
    variables: z.record(z.string(), z.unknown()).optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    history_id: z.string().uuid().optional(),
})
