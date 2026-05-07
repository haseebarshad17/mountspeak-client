import type { Metadata } from "next";

const siteTitle = "Tenta Client";
const siteUrl = "https://admin.tenta.com";
const description = `Tenta control plane for managing agencies, subscriptions, provisioning, and platform operations.`;
const ogImage = `${siteUrl}/og.png`;

export const defaultMeta: Metadata = {
    title: {
        default: siteTitle,
        template: `%s | ${siteTitle}`,
    },

    description,

    keywords: [
        "Tenta",
        "SaaS Admin",
        "Control Plane",
        "Multi-tenant",
        "Agency Management",
    ],

    metadataBase: new URL(siteUrl),
    // themeColor: "#003B95", // primary color
    applicationName: siteTitle,

    openGraph: {
        title: siteTitle,
        description,
        url: siteUrl,
        siteName: siteTitle,
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: "Tenta Admin Dashboard",
                type: "image/png",
            },
        ],
        locale: "en_US",
        type: "website",
    },

    twitter: {
        card: "summary_large_image",
        title: siteTitle,
        description,
        images: [ogImage],
    },

    appleWebApp: {
        title: siteTitle,
        statusBarStyle: "default",
        capable: true,
    },

    manifest: `${siteUrl}/manifest.webmanifest`,

    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "any" },
            { url: "/icon.svg", type: "image/svg+xml" },
        ],
        apple: "/apple-touch-icon.png",
    },

    robots: {
        index: false,
        follow: false,
    },
};