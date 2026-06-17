import type { AgencyHomepage } from '@/services/homepage/homepage.types'
import type { Metadata } from 'next'

function resolveAbsoluteAssetUrl(src: string, siteUrl: string): string {
    if (src.startsWith('http://') || src.startsWith('https://')) {
        return src
    }

    if (src.startsWith('/')) {
        return `${siteUrl}${src}`
    }

    return `${siteUrl}/${src}`
}

export function getAgencyFaviconIcons(homepage: AgencyHomepage): Metadata['icons'] {
    const siteUrl = homepage.siteUrl
    if (!siteUrl) return undefined

    const logoSrc = homepage.page.branding.logo.default.src
    if (!logoSrc) return undefined

    const iconUrl = resolveAbsoluteAssetUrl(logoSrc, siteUrl)

    return {
        icon: [{ url: iconUrl }],
        apple: iconUrl,
    }
}

export function getAgencyLayoutMetadata(homepage: AgencyHomepage): Metadata {
    const { branding, seo } = homepage.page
    const siteUrl = homepage.siteUrl

    if (!siteUrl) {
        throw new Error(
            `agency_site_theme.site_url is required for SEO metadata (agency ${homepage.agencyId}).`,
        )
    }

    const agencyName = branding.name
    const ogImage = resolveAbsoluteAssetUrl(seo.ogImage, siteUrl)

    return {
        title: {
            default: `Home | ${agencyName}`,
            template: `%s | ${agencyName}`,
        },
        description: seo.description,
        keywords: seo.keywords,
        metadataBase: new URL(siteUrl),
        applicationName: agencyName,
        icons: getAgencyFaviconIcons(homepage),
        openGraph: {
            title: `Home | ${agencyName}`,
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
            title: `Home | ${agencyName}`,
            description: seo.description,
            images: [ogImage],
        },
        appleWebApp: {
            title: agencyName,
            statusBarStyle: 'default',
            capable: true,
        },
        robots: seo.robots,
    }
}

export function getHomepageMetadata(homepage: AgencyHomepage): Metadata {
    const { seo } = homepage.page
    const base = getAgencyLayoutMetadata(homepage)
    const agencyName = homepage.page.branding.name

    return {
        ...base,
        title: {
            default: `Home | ${agencyName}`,
            template: `%s | ${agencyName}`,
        },
        description: seo.description,
        openGraph: {
            ...base.openGraph,
            title: `Home | ${agencyName}`,
            description: seo.description,
        },
        twitter: {
            ...base.twitter,
            title: `Home | ${agencyName}`,
            description: seo.description,
        },
    }
}
