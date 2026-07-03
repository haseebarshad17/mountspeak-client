import { SocialPlatformIcon } from '@/components/layout/marketing/SocialPlatformIcon'
import type { ActiveFooterSocialLink } from '@/lib/homepage/footer-social'
import { cn } from '@/lib/utils/clsxUtils'

export const socialIconLinkClassName = cn(
    'grid shrink-0 place-items-center rounded-sm bg-white',
    'shadow-[0_4px_16px_rgba(0,41,44,0.12)]',
    'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(0,41,44,0.16)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hp-color-primary)] focus-visible:ring-offset-2',
    'active:translate-y-0 active:scale-95',
)

type SocialIconLinkProps = {
    link: ActiveFooterSocialLink
    className?: string
}

export function SocialIconLink({ link, className }: SocialIconLinkProps) {
    return (
        <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className={cn(socialIconLinkClassName, className)}
        >
            <SocialPlatformIcon
                platform={link.platform}
                variant="brand"
                className={cn("w-8 h-8",)}
            />
        </a>
    )
}

type SocialIconLinksProps = {
    links: ActiveFooterSocialLink[]
    className?: string
    linkClassName?: string
}

export function SocialIconLinks({ links, className, linkClassName }: SocialIconLinksProps) {
    if (links.length === 0) return null

    return (
        <div className={cn('flex flex-wrap items-center gap-3', className)}>
            {links.map((link) => (
                <SocialIconLink key={link.platform} link={link} className={linkClassName} />
            ))}
        </div>
    )
}
