import { clientEnv } from '@/env/client'

import { STORAGE_MEDIA_PLACEHOLDER } from '@/lib/supabase/storage-media-placeholder'

/** Public bucket for agency homepage theme images (hero, sections, site logos). */
export const HOMEPAGE_MEDIA_BUCKET =
    process.env.NEXT_PUBLIC_SUPABASE_HOMEPAGE_STORAGE_BUCKET ?? 'agency-homepage-images'

/** Public bucket for trust-section logos (`agency_site_theme.branding_logos`). */
export const AGENCY_BRANDING_LOGOS_BUCKET =
    process.env.NEXT_PUBLIC_SUPABASE_BRANDING_LOGOS_BUCKET ?? 'agency-branding-logos'

export const HOMEPAGE_MEDIA_PLACEHOLDER = STORAGE_MEDIA_PLACEHOLDER

function buildStoragePublicUrl(
    bucket: string,
    pathOrUrl: string | null | undefined,
): string {
    if (!pathOrUrl?.trim()) {
        return ''
    }

    const value = pathOrUrl.trim()

    if (value.startsWith('http://') || value.startsWith('https://')) {
        return value
    }

    if (value.startsWith('/images/') || value.startsWith('/branding/')) {
        return value
    }

    const base = clientEnv.supabaseUrl.replace(/\/$/, '')
    let objectPath = value.replace(/^\//, '')

    if (objectPath.startsWith(`${bucket}/`)) {
        objectPath = objectPath.slice(bucket.length + 1)
    }

    return `${base}/storage/v1/object/public/${bucket}/${objectPath}`
}

export function resolveHomepageMediaUrl(pathOrUrl: string | null | undefined): string {
    return buildStoragePublicUrl(HOMEPAGE_MEDIA_BUCKET, pathOrUrl)
}

export function resolveBrandingLogoUrl(pathOrUrl: string | null | undefined): string {
    return buildStoragePublicUrl(AGENCY_BRANDING_LOGOS_BUCKET, pathOrUrl)
}

export function resolveHomepageMediaUrlOrPlaceholder(pathOrUrl: string | null | undefined): string {
    const resolved = resolveHomepageMediaUrl(pathOrUrl)
    return resolved || HOMEPAGE_MEDIA_PLACEHOLDER
}

export function resolveBrandingLogoUrlOrPlaceholder(pathOrUrl: string | null | undefined): string {
    const resolved = resolveBrandingLogoUrl(pathOrUrl)
    return resolved || HOMEPAGE_MEDIA_PLACEHOLDER
}
