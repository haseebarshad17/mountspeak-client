'use client'

import { useMemo } from 'react'
import { usePathname } from 'next/navigation'

import {
    prefixHref,
    resolveAgencyPreviewFromPathname,
    stripAgencyPreviewBase,
} from '@/lib/homepage/agency-preview'

export function useAgencyPreviewBase(): string | null {
    const pathname = usePathname()

    return useMemo(() => {
        return resolveAgencyPreviewFromPathname(pathname)?.previewBase ?? null
    }, [pathname])
}

export function usePrefixedHref(href: string | undefined): string | undefined {
    const previewBase = useAgencyPreviewBase()

    return useMemo(() => {
        if (!href) return href
        return prefixHref(href, previewBase)
    }, [href, previewBase])
}

export function usePreviewPath(path: string): string {
    const previewBase = useAgencyPreviewBase()

    return useMemo(() => prefixHref(path, previewBase), [path, previewBase])
}

export function useInternalPathname(): string {
    const pathname = usePathname()

    return useMemo(() => stripAgencyPreviewBase(pathname), [pathname])
}
