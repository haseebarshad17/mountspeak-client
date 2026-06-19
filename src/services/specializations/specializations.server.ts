import { cache } from 'react'
import { unstable_noStore as noStore } from 'next/cache'

import { createPublicSupabase } from '@/lib/supabase/supabase.public.server'

import { specializationsService } from './specializations.service'
import type { Specialization } from './specializations.types'

export const fetchSpecializations = cache(async (): Promise<Specialization[]> => {
    noStore()

    const supabase = createPublicSupabase()
    const api = specializationsService({ supabase })
    return api.getAll()
})
