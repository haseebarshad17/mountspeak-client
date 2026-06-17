'use client'

import { useMemo } from 'react'
import { usePathname } from 'next/navigation'

import {
    prefixHref,
    resolveAgencyPreviewForRequest,
} from '@/lib/homepage/agency-preview'

export function useAgencyPreviewBase(): string | null {
    const pathname = usePathname()

    return useMemo(() => {
        if (typeof window === 'undefined') return null
        return resolveAgencyPreviewForRequest(pathname, window.location.hostname)?.previewBase ?? null
    }, [pathname])
}

export function usePrefixedHref(href: string | undefined): string | undefined {
    const previewBase = useAgencyPreviewBase()

    return useMemo(() => {
        if (!href) return href
        return prefixHref(href, previewBase)
    }, [href, previewBase])
}

export function useInternalPathname(): string {
    const pathname = usePathname()

    return useMemo(() => {
        if (typeof window !== 'undefined') {
            const preview = resolveAgencyPreviewForRequest(pathname, window.location.hostname)
            if (preview) return preview.internalPathname
        }
        return pathname
    }, [pathname])
}
