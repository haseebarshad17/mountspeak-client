import { redirect } from 'next/navigation'

import { createServerSupabase } from '@/lib/supabase/supabase.server'

export async function redirectIfAuthenticated(destination = '/') {
    const supabase = await createServerSupabase()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (user) {
        redirect(destination)
    }
}
