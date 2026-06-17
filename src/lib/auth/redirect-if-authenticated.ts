import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

import { prefixHref } from '@/lib/homepage/agency-preview'
import { createServerSupabase } from '@/lib/supabase/supabase.server'

export async function redirectIfAuthenticated(destination = '/') {
    const supabase = await createServerSupabase()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (user) {
        const headersList = await headers()
        const previewBase = headersList.get('x-agency-preview-base')
        redirect(prefixHref(destination, previewBase))
    }
}
