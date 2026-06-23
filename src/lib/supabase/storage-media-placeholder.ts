/** Fallback when Supabase storage media is missing or fails to load. */
export const STORAGE_MEDIA_PLACEHOLDER = '/placeholder.svg'

export function isSupabaseStoragePublicUrl(url: string | null | undefined): boolean {
    return Boolean(url?.includes('/storage/v1/object/public/'))
}
