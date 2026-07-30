'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/supabase.client'
import { getAgencyContent, getAgencyTheme } from './agency.service'

function resolveClientHost() {
    if (typeof window === 'undefined') return 'localhost:3000'
    return window.location.host
}

export const agencyQueryKeys = {
    all: ['agency'] as const,
    content: (host: string) => [...agencyQueryKeys.all, 'content', host] as const,
    theme: (host: string) => [...agencyQueryKeys.all, 'theme', host] as const,
}

export function useGetAgencyContent(host?: string) {
    const resolvedHost = host ?? resolveClientHost()

    return useQuery({
        queryKey: agencyQueryKeys.content(resolvedHost),
        queryFn: () => getAgencyContent({ supabase, host: resolvedHost }),
    })
}

export function useGetAgencyTheme(host?: string) {
    const resolvedHost = host ?? resolveClientHost()

    return useQuery({
        queryKey: agencyQueryKeys.theme(resolvedHost),
        queryFn: () => getAgencyTheme({ supabase, host: resolvedHost }),
    })
}
