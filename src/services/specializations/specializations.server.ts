import { cache } from 'react'
import { unstable_cache } from 'next/cache'

import { createPublicSupabase } from '@/lib/supabase/supabase.public.server'

import { specializationsService } from './specializations.service'
import type { Specialization } from './specializations.types'

async function loadSpecializations(): Promise<Specialization[]> {
    const supabase = createPublicSupabase()
    const api = specializationsService({ supabase })
    return api.getAll()
}

const getCachedSpecializations = unstable_cache(
    loadSpecializations,
    ['specializations-all'],
    { revalidate: 3600, tags: ['specializations'] },
)

export const fetchSpecializations = cache(async (): Promise<Specialization[]> => {
    return getCachedSpecializations()
})
