import { useQuery } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase/supabase.client'

import { contentPagesService } from './content.service'
import type { AboutUsDocument, LegalDocument } from './content.type'

export const contentPagesQueryKey = (agencyId: string | null) =>
    ['content-pages', agencyId] as const

export const termsQueryKey = (agencyId: string | null) =>
    ['content-pages', 'terms', agencyId] as const

export const privacyQueryKey = (agencyId: string | null) =>
    ['content-pages', 'privacy', agencyId] as const

export const aboutQueryKey = (agencyId: string | null) =>
    ['content-pages', 'about', agencyId] as const

export const useAgencyTerms = (agencyId: string | null, enabled: boolean) => {
    return useQuery({
        queryKey: termsQueryKey(agencyId),
        enabled: enabled && Boolean(agencyId),
        queryFn: async (): Promise<LegalDocument | null> => {
            const api = contentPagesService({ supabase, agencyId: agencyId! })
            return api.getTermsAndConditions()
        },
        staleTime: 60_000,
    })
}

export const useAgencyPrivacy = (agencyId: string | null, enabled: boolean) => {
    return useQuery({
        queryKey: privacyQueryKey(agencyId),
        enabled: enabled && Boolean(agencyId),
        queryFn: async (): Promise<LegalDocument | null> => {
            const api = contentPagesService({ supabase, agencyId: agencyId! })
            return api.getPrivacyPolicy()
        },
        staleTime: 60_000,
    })
}

export const useAgencyAbout = (agencyId: string | null, enabled: boolean) => {
    return useQuery({
        queryKey: aboutQueryKey(agencyId),
        enabled: enabled && Boolean(agencyId),
        queryFn: async (): Promise<AboutUsDocument | null> => {
            const api = contentPagesService({ supabase, agencyId: agencyId! })
            return api.getAboutUs()
        },
        staleTime: 60_000,
    })
}
