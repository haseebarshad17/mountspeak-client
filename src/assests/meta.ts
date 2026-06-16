import type { Metadata } from 'next'

const siteTitle = 'Home'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tripconnect.app'
const description =
    'Discover tours, plan your trip, and book with trusted travel agencies across Pakistan.'
const ogImage = `${siteUrl}/images/pages/home/tour-list.png`

export const defaultMeta: Metadata = {
    title: {
        default: siteTitle,
        template: `%s | Trip Connect`,
    },

    description,

    keywords: [
        'Trip Connect',
        'Pakistan travel',
        'tour packages',
        'travel agency',
        'adventure tours',
    ],

    metadataBase: new URL(siteUrl),
    applicationName: 'Trip Connect',

    openGraph: {
        title: siteTitle,
        description,
        url: siteUrl,
        siteName: 'Trip Connect',
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
        title: siteTitle,
        description,
        images: [ogImage],
    },

    appleWebApp: {
        title: 'Trip Connect',
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
