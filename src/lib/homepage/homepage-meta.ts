import type { AgencyHomepage } from '@/services/homepage/homepage.types'
import type { Metadata } from 'next'

export function getHomepageMetadata(homepage: AgencyHomepage): Metadata {
    const { seo, branding } = homepage.page
    const siteUrl = homepage.siteUrl

    if (!siteUrl) {
        throw new Error(
            `agency_site_theme.site_url is required for SEO metadata (agency ${homepage.agencyId}).`,
        )
    }

    const ogImage =
        seo.ogImage.startsWith('http://') ||
        seo.ogImage.startsWith('https://')
            ? seo.ogImage
            : seo.ogImage.startsWith('/')
              ? `${siteUrl}${seo.ogImage}`
              : seo.ogImage

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
            card: seo.twitterCard as 'summary_large_image',
            title: seo.title,
            description: seo.description,
            images: [ogImage],
        },
        robots: seo.robots,
    }
}
