import type { Metadata } from 'next'

import { normalizeSiteUrl } from '@/lib/utils/site-url'

const siteTitle = 'Home'
const description =
    'Discover tours, plan your trip, and book with trusted travel agencies across Pakistan.'

export const platformMetaContent = {
    siteTitle,
    description,
    keywords: [
        'Trip Connect',
        'Pakistan travel',
        'tour packages',
        'travel agency',
        'adventure tours',
    ],
    applicationName: 'Trip Connect',
    siteName: 'Trip Connect',
    ogImagePath: '/images/pages/home/tour-list.png',
} as const

export function buildPlatformMetadata(siteUrl: string): Metadata {
    const base = normalizeSiteUrl(siteUrl)
    const ogImage = `${base}${platformMetaContent.ogImagePath}`

    return {
        title: {
            default: platformMetaContent.siteTitle,
            template: `%s | ${platformMetaContent.applicationName}`,
        },
        description: platformMetaContent.description,
        keywords: [...platformMetaContent.keywords],
        metadataBase: new URL(base),
        applicationName: platformMetaContent.applicationName,
        openGraph: {
            title: platformMetaContent.siteTitle,
            description: platformMetaContent.description,
            url: base,
            siteName: platformMetaContent.siteName,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: 'Trip Connect — travel and tours',
                    type: 'image/png',
                },
            ],
            locale: 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: platformMetaContent.siteTitle,
            description: platformMetaContent.description,
            images: [ogImage],
        },
        appleWebApp: {
            title: platformMetaContent.applicationName,
            statusBarStyle: 'default',
            capable: true,
        },
        icons: {
            icon: [
                { url: '/favicon.ico', sizes: 'any' },
                { url: '/icon.svg', type: 'image/svg+xml' },
            ],
            apple: '/apple-touch-icon.png',
        },
        robots: {
            index: true,
            follow: true,
        },
    }
}
