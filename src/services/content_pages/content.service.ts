import type { SupabaseClient } from '@supabase/supabase-js'

import type { AboutUsDocument, ContentPagesRow, LegalDocument } from './content.type'

const contentPagesColumns =
    'id, agency_id, terms_and_conditions, privacy_policy, about_us, created_at, updated_at'

type ContentPagesServiceProps = {
    supabase: SupabaseClient
    agencyId: string
}

function hasAboutContent(about: AboutUsDocument | null | undefined): about is AboutUsDocument {
    return Boolean(about && (about.hero || about.mission || about.values || about.aboutCompany))
}

export const contentPagesService = ({ supabase, agencyId }: ContentPagesServiceProps) => {
    const getByAgencyId = async (): Promise<ContentPagesRow | null> => {
        const { data, error } = await supabase
            .from('content_pages')
            .select(contentPagesColumns)
            .eq('agency_id', agencyId)
            .maybeSingle()

        if (error) throw error

        return (data as ContentPagesRow | null) ?? null
    }

    return {
        getByAgencyId,
        getTermsAndConditions: async (): Promise<LegalDocument | null> => {
            const row = await getByAgencyId()
            return row?.terms_and_conditions ?? null
        },
        getPrivacyPolicy: async (): Promise<LegalDocument | null> => {
            const row = await getByAgencyId()
            return row?.privacy_policy ?? null
        },
        getAboutUs: async (): Promise<AboutUsDocument | null> => {
            const row = await getByAgencyId()
            const about = row?.about_us ?? null
            return hasAboutContent(about) ? about : null
        },
    }
}
