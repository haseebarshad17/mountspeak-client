'use client'

import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/supabase.client'
import { subscribeService } from './subscribe.service'
import type { CreateSubscribeDTO } from './subscribe.types'

const subscribe = subscribeService({ supabase })

export function useCreateSubscription() {
    return useMutation({
        mutationFn: (payload: CreateSubscribeDTO) =>
            subscribe.createSubscription(payload),
    })
}
