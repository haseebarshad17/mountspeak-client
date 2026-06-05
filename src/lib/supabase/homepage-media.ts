import { clientEnv } from '@/env/client'

/** Public bucket for agency homepage theme images (logos, hero, sections). */
export const HOMEPAGE_MEDIA_BUCKET =
    process.env.NEXT_PUBLIC_SUPABASE_HOMEPAGE_STORAGE_BUCKET ?? 'agency-homepage-images'

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
