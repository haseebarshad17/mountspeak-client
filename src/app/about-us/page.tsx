import type { Metadata } from 'next'
import { AboutPageContent } from '@/components/pages/AboutPageContent'
import { MarketingPageShell } from '@/components/pages/MarketingPageShell'
import { loadAgencyContext } from '@/lib/site/load-agency-context'
import { resolveThemeAssetUrl } from '@/lib/media/resolve-theme-asset'
import { createServerSupabase } from '@/lib/supabase/supabase.server'
import { getAboutUsContent } from '@/services/content-pages/content-pages.service'

export async function generateMetadata(): Promise<Metadata> {
    const { homepage } = await loadAgencyContext()
    const about = await getAboutUsContent({
        supabase: createServerSupabase(),
        agencyId: homepage.agencyId,
    })
    const seo = about?.meta?.seo

    if (!seo) return { title: about?.meta?.title || 'About Us' }

    return {
        title: seo.title || about?.meta?.title || 'About Us',
        description: seo.description,
        keywords: seo.keywords,
    }
}

export default async function AboutUsPage() {
    const { homepage, capabilities } = await loadAgencyContext()
    const about = await getAboutUsContent({
        supabase: createServerSupabase(),
        agencyId: homepage.agencyId,
    })

    return (
        <MarketingPageShell
            page={homepage.page}
            capabilities={capabilities}
            agencyId={homepage.agencyId}
            title={about?.hero?.title || 'About Us'}
            subtitle={
                about?.hero?.subtitle ||
                'Thoughtful travel experiences with clear, specialization-based service delivery.'
            }
            heroImageOverride={resolveThemeAssetUrl(about?.hero?.backgroundImage)}
            heroSize="default"
            heroActions={[
                { label: 'Explore tours', href: '/tours' },
                { label: 'Contact us', href: '/contact-us', variant: 'ghost' },
            ]}
        >
            <AboutPageContent about={about} />
        </MarketingPageShell>
    )
}
