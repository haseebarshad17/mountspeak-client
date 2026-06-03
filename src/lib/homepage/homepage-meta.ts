import { homepage } from '@/data/homepage'
import type { Metadata } from 'next'

const { seo, branding } = homepage

function resolveSiteUrl() {
    const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
    if (fromEnv) return fromEnv
    return 'https://phnestravels.com'
}

export function getHomepageMetadata(): Metadata {
    const siteUrl = resolveSiteUrl()
    const ogImage = seo.ogImage.startsWith('http') ? seo.ogImage : `${siteUrl}${seo.ogImage}`

    return {
        title: {
            default: seo.title,
            template: seo.titleTemplate,
        },
        description: seo.description,
        keywords: seo.keywords,
        metadataBase: new URL(siteUrl),
        applicationName: branding.name,
        openGraph: {
            title: seo.title,
            description: seo.description,
            url: `${siteUrl}${seo.canonicalUrl}`,
            siteName: seo.siteName,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: seo.ogImageAlt,
                },
            ],
            locale: seo.locale,
            type: 'website',
        },
        twitter: {
            card: seo.twitterCard,
            title: seo.title,
            description: seo.description,
            images: [ogImage],
        },
        robots: seo.robots,
    }
}
