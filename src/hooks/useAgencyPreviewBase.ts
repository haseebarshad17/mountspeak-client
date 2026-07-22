'use client'

import { useCallback, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { buildBookingHref } from '@/components/pages/booking/booking.types'
import {
    getAgencyPreviewBaseFromPathname,
    prefixHref,
    stripAgencyPreviewBase,
} from '@/lib/homepage/agency-preview'

export function useAgencyPreviewBase(): string | null {
    const pathname = usePathname()

    return useMemo(() => getAgencyPreviewBaseFromPathname(pathname), [pathname])
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

export function useBookingHref(
    tourSlug?: string | null,
    slotId?: string | null,
): string {
    const previewBase = useAgencyPreviewBase()

    return useMemo(() => {
        // Packages use inquiry CTAs; only domestic tours hit /booking.
        return prefixHref(
            buildBookingHref(tourSlug ?? undefined, slotId ?? undefined),
            previewBase,
        )
    }, [previewBase, slotId, tourSlug])
}

export function useInternalPathname(): string {
    const pathname = usePathname()

    return useMemo(() => stripAgencyPreviewBase(pathname), [pathname])
}

export function usePreviewRouter() {
    const router = useRouter()
    const previewBase = useAgencyPreviewBase()

    const push = useCallback(
        (href: string) => router.push(prefixHref(href, previewBase)),
        [previewBase, router],
    )

    const replace = useCallback(
        (href: string) => router.replace(prefixHref(href, previewBase)),
        [previewBase, router],
    )

    const prefetch = useCallback(
        (href: string) => router.prefetch(prefixHref(href, previewBase)),
        [previewBase, router],
    )

    return useMemo(
        () => ({
            push,
            replace,
            prefetch,
            refresh: router.refresh,
            back: router.back,
            forward: router.forward,
        }),
        [push, prefetch, replace, router],
    )
}
