'use client'

import { useEffect, useState } from 'react'

import {
    STORAGE_MEDIA_PLACEHOLDER,
} from '@/lib/supabase/storage-media-placeholder'

export function useStorageBackgroundImage(
    src: string | null | undefined,
    fallback: string = STORAGE_MEDIA_PLACEHOLDER,
) {
    const [backgroundImage, setBackgroundImage] = useState(() => {
        const trimmed = src?.trim()
        return trimmed || fallback
    })

    useEffect(() => {
        const trimmed = src?.trim()

        if (!trimmed) {
            setBackgroundImage(fallback)
            return
        }

        let cancelled = false
        const probe = new window.Image()

        probe.onload = () => {
            if (!cancelled) {
                setBackgroundImage(trimmed)
            }
        }

        probe.onerror = () => {
            if (cancelled) return
            setBackgroundImage(STORAGE_MEDIA_PLACEHOLDER)
        }

        probe.src = trimmed

        return () => {
            cancelled = true
        }
    }, [fallback, src])

    return backgroundImage
}
