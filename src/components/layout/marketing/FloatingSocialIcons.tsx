'use client'

import { useEffect, useState } from 'react'

import { SocialIconLink } from '@/components/layout/marketing/SocialIconLink'
import { useHomepagePageWithFallback } from '@/hooks/useHomepagePageWithFallback'
import { getActiveFooterSocialLinks } from '@/lib/homepage/footer-social'
import { cn } from '@/lib/utils/clsxUtils'

export default function FloatingSocialIcons() {
    const page = useHomepagePageWithFallback()
    const [isFooterVisible, setIsFooterVisible] = useState(false)

    useEffect(() => {
        const scrollRoot = document.getElementById('app-scroll-container')
        const footer = document.getElementById('marketing-footer')

        if (!scrollRoot || !footer) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsFooterVisible(entry.isIntersecting)
            },
            {
                root: scrollRoot,
                threshold: 0,
            },
        )

        observer.observe(footer)

        return () => observer.disconnect()
    }, [])

    if (!page) return null

    const links = getActiveFooterSocialLinks(page.footer.socialLinks)
    if (links.length === 0) return null

    return (
        <aside
            aria-label="Social media links"
            className={cn(
                'pointer-events-none fixed right-3 top-1/2 z-[85] flex -translate-y-1/2 flex-col items-center gap-3 sm:right-4',
            )}
        >
            {links.map((link) => (
                <SocialIconLink
                    key={link.platform}
                    link={link}
                    className={cn(
                        'pointer-events-auto',
                        isFooterVisible && 'pointer-events-none translate-x-[120%] opacity-0',
                    )}
                />
            ))}
        </aside>
    )
}
