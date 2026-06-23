import { clientEnv } from '@/env/client'

import { STORAGE_MEDIA_PLACEHOLDER } from '@/lib/supabase/storage-media-placeholder'

/** Public bucket for agency homepage theme images (logos, hero, sections). */
export const HOMEPAGE_MEDIA_BUCKET =
    process.env.NEXT_PUBLIC_SUPABASE_HOMEPAGE_STORAGE_BUCKET ?? 'agency-homepage-images'

export const HOMEPAGE_MEDIA_PLACEHOLDER = STORAGE_MEDIA_PLACEHOLDER

export function resolveHomepageMediaUrl(pathOrUrl: string | null | undefined): string {
    if (!pathOrUrl?.trim()) {
        return ''
    }

    const value = pathOrUrl.trim()

    if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/')) {
        return value
    }

    const base = clientEnv.supabaseUrl.replace(/\/$/, '')
    const normalizedPath = value.replace(/^\//, '')

    return `${base}/storage/v1/object/public/${HOMEPAGE_MEDIA_BUCKET}/${normalizedPath}`
}

export function resolveHomepageMediaUrlOrPlaceholder(pathOrUrl: string | null | undefined): string {
    const resolved = resolveHomepageMediaUrl(pathOrUrl)
    return resolved || HOMEPAGE_MEDIA_PLACEHOLDER
}
