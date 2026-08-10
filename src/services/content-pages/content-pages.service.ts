import type { SupabaseClient } from '@supabase/supabase-js'
import type { AboutUsDocument, ContentPagesRow } from './content-pages.types'

const CONTENT_PAGES_COLUMNS =
    'id, agency_id, terms_and_conditions, privacy_policy, about_us, created_at, updated_at'

export function getContentPagesService({ supabase }: { supabase: SupabaseClient }) {
    return {
        async getContentPagesRow(agencyId: string): Promise<ContentPagesRow | null> {
            if (!agencyId?.trim()) return null

            const { data, error } = await supabase
                .from('content_pages')
                .select(CONTENT_PAGES_COLUMNS)
                .eq('agency_id', agencyId)
                .maybeSingle()

            if (error) throw error
            return (data as ContentPagesRow | null) ?? null
        },

        async getAboutUsContent(agencyId: string): Promise<AboutUsDocument | null> {
            const row = await this.getContentPagesRow(agencyId)
            return row?.about_us ?? null
        },
    }
}

export async function getAboutUsContent({
    supabase,
    agencyId,
}: {
    supabase: SupabaseClient
    agencyId: string
}): Promise<AboutUsDocument | null> {
    try {
        return await getContentPagesService({ supabase }).getAboutUsContent(agencyId)
    } catch {
        return null
    }
}
