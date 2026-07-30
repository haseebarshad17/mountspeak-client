'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { Toaster } from 'sonner'
import { TemplateVariantProvider } from '@/hooks/useTemplateVariant'

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60,
                retry: 1,
                refetchOnWindowFocus: false,
            },
        },
    })
}

export function AppProviders({
    templateId,
    children,
}: {
    templateId?: string | null
    children: ReactNode
}) {
    const [queryClient] = useState(() => makeQueryClient())

    return (
        <QueryClientProvider client={queryClient}>
            <TemplateVariantProvider templateId={templateId}>
                {children}
                <Toaster position="top-center" richColors closeButton />
            </TemplateVariantProvider>
        </QueryClientProvider>
    )
}
