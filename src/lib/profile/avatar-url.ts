const UPLOADED_AVATAR_MARKER = '/storage/v1/object/public/avatars/'

/** True only for photos uploaded to the avatars storage bucket. */
export function isUserUploadedAvatarUrl(url: string | null | undefined): url is string {
  if (!url?.trim()) return false
  return url.includes(UPLOADED_AVATAR_MARKER)
}

export function resolveProfileAvatarUrl(url: string | null | undefined): string | null {
  return isUserUploadedAvatarUrl(url) ? url : null
}
