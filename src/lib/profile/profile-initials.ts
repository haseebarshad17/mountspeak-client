export function getProfileInitials(name: string | null | undefined): string {
    const trimmed = name?.trim()
    if (!trimmed) return '?'

    const firstName = trimmed.split(/\s+/).filter(Boolean)[0]
    return (firstName?.[0] ?? '?').toUpperCase()
}
