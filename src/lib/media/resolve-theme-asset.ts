import { clientEnv } from '@/env/client'

const HOMEPAGE_BUCKET =
    process.env.NEXT_PUBLIC_SUPABASE_HOMEPAGE_STORAGE_BUCKET?.trim() ||
    'agency-homepage-images'

const TOUR_BUCKET =
    process.env.NEXT_PUBLIC_SUPABASE_TOUR_STORAGE_BUCKET?.trim() || 'tour-media'

const BRANDING_BUCKET =
    process.env.NEXT_PUBLIC_SUPABASE_BRANDING_LOGOS_BUCKET?.trim() ||
    'agency-branding-logos'

function resolveStorageUrl(
    src: string | null | undefined,
    bucket: string
): string {
    if (!src?.trim()) return ''

    const value = src.trim()
    if (
        value.startsWith('http://') ||
        value.startsWith('https://') ||
        value.startsWith('data:') ||
        value.startsWith('blob:')
    ) {
        return value
    }

    if (value.startsWith('/')) return value

    const base = clientEnv.SupabaseURL.replace(/\/$/, '')
    const path = value.replace(/^\//, '')
    return `${base}/storage/v1/object/public/${bucket}/${path}`
}

/** Resolve theme / homepage CMS media paths. */
export function resolveThemeAssetUrl(src: string | null | undefined): string {
    return resolveStorageUrl(src, HOMEPAGE_BUCKET)
}

/** Resolve tour / package listing media paths. */
export function resolveTourAssetUrl(src: string | null | undefined): string {
    return resolveStorageUrl(src, TOUR_BUCKET)
}

/** Resolve branding logo paths. */
export function resolveBrandingAssetUrl(src: string | null | undefined): string {
    return resolveStorageUrl(src, BRANDING_BUCKET)
}

/** Prefer hero backgroundImages, then backgroundImage, then other section media. */
export function collectHeroCardImages(
    sources: Array<string | null | undefined>,
    limit = 3
): string[] {
    const seen = new Set<string>()
    const images: string[] = []

    for (const src of sources) {
        const resolved = resolveThemeAssetUrl(src)
        if (!resolved || seen.has(resolved)) continue
        seen.add(resolved)
        images.push(resolved)
        if (images.length >= limit) break
    }

    return images
}
