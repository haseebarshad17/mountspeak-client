import { clientEnv } from '@/env/client'

/** Public bucket for tour images (paths stored on tours.*.image_url fields). */
export const TOUR_MEDIA_BUCKET =
    process.env.NEXT_PUBLIC_SUPABASE_TOUR_STORAGE_BUCKET ?? 'tour-media'

export const TOUR_MEDIA_PLACEHOLDER =
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'

export function resolveTourMediaUrl(pathOrUrl: string | null | undefined): string {
    if (!pathOrUrl?.trim()) {
        return ''
    }

    const value = pathOrUrl.trim()

    if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/')) {
        return value
    }

    const base = clientEnv.supabaseUrl.replace(/\/$/, '')
    const normalizedPath = value.replace(/^\//, '')

    return `${base}/storage/v1/object/public/${TOUR_MEDIA_BUCKET}/${normalizedPath}`
}

export function resolveTourMediaUrlOrPlaceholder(pathOrUrl: string | null | undefined): string {
    const resolved = resolveTourMediaUrl(pathOrUrl)
    return resolved || TOUR_MEDIA_PLACEHOLDER
}
