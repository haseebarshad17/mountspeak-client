import { clientEnv } from '@/env/client'

import { STORAGE_MEDIA_PLACEHOLDER } from '@/lib/supabase/storage-media-placeholder'

export type PackageMediaKind = 'umrah' | 'international'

const PACKAGE_MEDIA_BUCKETS: Record<PackageMediaKind, string> = {
    umrah: 'umrah-media',
    international: 'international-media',
}

export function resolvePackageMediaUrl(
    pathOrUrl: string | null | undefined,
    kind: PackageMediaKind,
): string {
    if (!pathOrUrl?.trim()) return ''

    const value = pathOrUrl.trim()

    // If an absolute URL or a root-relative path is already stored, keep it.
    if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/')) {
        return value
    }

    const base = clientEnv.supabaseUrl.replace(/\/$/, '')
    const normalizedPath = value.replace(/^\//, '')
    const bucket = PACKAGE_MEDIA_BUCKETS[kind]

    return `${base}/storage/v1/object/public/${bucket}/${normalizedPath}`
}

export function resolvePackageMediaUrlOrPlaceholder(
    pathOrUrl: string | null | undefined,
    kind: PackageMediaKind,
): string {
    const resolved = resolvePackageMediaUrl(pathOrUrl, kind)
    return resolved || STORAGE_MEDIA_PLACEHOLDER
}

