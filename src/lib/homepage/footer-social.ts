import type { FooterSocialLinks } from '@/services/homepage/homepage.page.types'

export type SocialPlatform = keyof FooterSocialLinks

const SOCIAL_LABELS: Record<SocialPlatform, string> = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    twitter: 'Twitter',
}

const SOCIAL_PLATFORMS: SocialPlatform[] = ['facebook', 'instagram', 'linkedin', 'twitter']

export function resolveSocialUrl(url: string): string {
    const trimmed = url.trim()
    if (!trimmed) return ''

    if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) return trimmed
    if (trimmed.startsWith('//')) return `https:${trimmed}`

    return `https://${trimmed.replace(/^\/+/, '')}`
}

export type ActiveFooterSocialLink = {
    platform: SocialPlatform
    href: string
    label: string
}

export function getActiveFooterSocialLinks(
    socialLinks?: FooterSocialLinks | null,
): ActiveFooterSocialLink[] {
    if (!socialLinks) return []

    return SOCIAL_PLATFORMS.flatMap((platform) => {
        const raw = socialLinks[platform]
        if (!raw?.trim()) return []

        const href = resolveSocialUrl(raw)
        if (!href) return []

        return [{ platform, href, label: SOCIAL_LABELS[platform] }]
    })
}
