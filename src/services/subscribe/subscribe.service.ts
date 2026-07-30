import type { SupabaseClient } from '@supabase/supabase-js'
import { toApiError } from '@/lib/api/errors'
import { MessageCode } from '@/lib/messages/codes'
import type { CreateSubscribeDTO, SubscribeRecord } from './subscribe.types'

const SUBSCRIBE_TABLE = 'subscribe'

export function subscribeService({ supabase }: { supabase: SupabaseClient }) {
    return {
        async createSubscription(
            payload: CreateSubscribeDTO
        ): Promise<SubscribeRecord> {
            const { data, error } = await supabase
                .from(SUBSCRIBE_TABLE)
                .insert(payload)
                .select()
                .maybeSingle()

            if (error) {
                throw toApiError(error, MessageCode.API_NEWSLETTER_SUBSCRIBE_FAILED)
            }

            if (data) return data as SubscribeRecord
            return { ...payload }
        },
    }
}
