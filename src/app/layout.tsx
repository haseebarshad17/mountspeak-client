import '@/assets/globals.css'
import '@/env/client'

import type { Metadata, Viewport } from 'next'
import { jost, roboto } from '@/assets/fonts'
import { AppProviders } from '@/components/providers/AppProviders'
import { getRequestHost } from '@/lib/host/request-host'
import { resolveThemeAssetUrl } from '@/lib/media/resolve-theme-asset'
import { resolveTemplateVariant } from '@/lib/templates/resolve-variant'
import { cn } from '@/lib/utils/cn'
import { createServerSupabase } from '@/lib/supabase/supabase.server'
import { getAgencyContent, getDefaultHomepage } from '@/services/agency/agency.service'

function resolveFaviconUrl(src?: string | null): string | undefined {
    if (!src?.trim()) return undefined
    const resolved = resolveThemeAssetUrl(src)
    return resolved || undefined
}

export async function generateMetadata(): Promise<Metadata> {
    try {
        const host = await getRequestHost()
        const homepage = await getAgencyContent({
            supabase: createServerSupabase(),
            host,
        })
        const { seo, branding } = homepage.page
        const iconUrl =
            resolveFaviconUrl(branding.logo?.default?.src) ||
            resolveFaviconUrl(branding.logo?.onDark?.src)

        let metadataBase: URL | undefined
        try {
            metadataBase = new URL(
                homepage.siteUrl?.startsWith('http')
                    ? homepage.siteUrl
                    : `http://${host}`
            )
        } catch {
            metadataBase = new URL('http://localhost:3000')
        }

        return {
            metadataBase,
            title: seo.title || branding.name,
            description: seo.description,
            keywords: seo.keywords,
            icons: iconUrl
                ? {
                    icon: [{ url: iconUrl }],
                    shortcut: [{ url: iconUrl }],
                    apple: [{ url: iconUrl }],
                }
                : undefined,
            openGraph: {
                title: seo.title,
                description: seo.description,
                images: seo.ogImage
                    ? [
                        {
                            url: resolveThemeAssetUrl(seo.ogImage) || seo.ogImage,
                            alt: seo.ogImageAlt,
                        },
                    ]
                    : undefined,
            },
        }
    } catch {
        const fallback = getDefaultHomepage()
        const iconUrl = resolveFaviconUrl(fallback.page.branding.logo?.default?.src)
        return {
            title: fallback.page.seo.title,
            description: fallback.page.seo.description,
            icons: iconUrl
                ? {
                    icon: [{ url: iconUrl }],
                    apple: [{ url: iconUrl }],
                }
                : undefined,
        }
    }
}

export async function generateViewport(): Promise<Viewport> {
    try {
        const host = await getRequestHost()
        const homepage = await getAgencyContent({
            supabase: createServerSupabase(),
            host,
        })

        return {
            themeColor: homepage.page.seo.themeColor,
        }
    } catch {
        return { themeColor: '#276968' }
    }
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    let templateId: string | null = null
    let primary = '#276968'

    try {
        const host = await getRequestHost()
        const homepage = await getAgencyContent({
            supabase: createServerSupabase(),
            host,
        })
        templateId = homepage.page.templateId
        primary = homepage.page.theme.buttons.primary.background
    } catch {
        const fallback = getDefaultHomepage()
        templateId = fallback.page.templateId
        primary = fallback.page.theme.buttons.primary.background
    }

    const variant = resolveTemplateVariant(templateId)

    return (
        <html
            lang="en"
            data-template={variant}
            className={cn(jost.variable, roboto.variable)}
        >
            <body
                className={cn(
                    'site-bg min-h-screen font-sans antialiased',
                    roboto.className
                )}
                style={
                    {
                        ['--color-brand' as string]: primary,
                    } as React.CSSProperties
                }
            >
                <AppProviders templateId={templateId}>{children}</AppProviders>
            </body>
        </html>
    )
}
