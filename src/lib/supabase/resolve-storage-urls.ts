import { resolveHomepageMediaUrlOrPlaceholder } from '@/lib/supabase/homepage-media'

function looksLikeStoragePath(value: string): boolean {
    const trimmed = value.trim()

    if (
        !trimmed ||
        trimmed.startsWith('http://') ||
        trimmed.startsWith('https://') ||
        trimmed.startsWith('/')
    ) {
        return false
    }

    if (
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\//i.test(
            trimmed,
        )
    ) {
        return true
    }

    return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(trimmed) && trimmed.includes('/')
}

export function resolveStorageUrlsDeep<T>(value: T): T {
    if (typeof value === 'string') {
        return (
            looksLikeStoragePath(value) ? resolveHomepageMediaUrlOrPlaceholder(value) : value
        ) as T
    }

    if (Array.isArray(value)) {
        return value.map((item) => resolveStorageUrlsDeep(item)) as T
    }

    if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
            Object.entries(value).map(([key, nestedValue]) => [
                key,
                resolveStorageUrlsDeep(nestedValue),
            ]),
        ) as T
    }

    return value
}
