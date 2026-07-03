import type { ComponentType } from 'react'

import Facebook from '@/assests/svg/social/Facebook'
import Instagram from '@/assests/svg/social/Instagram'
import Linkedin from '@/assests/svg/social/Linkedin'
import Twitter from '@/assests/svg/social/Twitter'
import type { SocialPlatform } from '@/lib/homepage/footer-social'
import { cn } from '@/lib/utils/clsxUtils'

type SocialPlatformIconProps = {
    platform: SocialPlatform
    className?: string
    variant?: 'brand' | 'mono'
}

const SOCIAL_ICON_COMPONENTS: Record<SocialPlatform, ComponentType<{ className?: string }>> = {
    facebook: Facebook,
    instagram: Instagram,
    linkedin: Linkedin,
    twitter: Twitter,
}

export function SocialPlatformIcon({ platform, className, variant = 'brand' }: SocialPlatformIconProps) {
    const Icon = SOCIAL_ICON_COMPONENTS[platform]
    if (!Icon) return null

    return (
        <Icon
            className={cn(
                variant === 'mono' && 'brightness-0 invert',
                className,
            )}
        />
    )
}
