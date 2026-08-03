import { AboutPageContent } from '@/components/pages/AboutPageContent'
import { MarketingPageShell } from '@/components/pages/MarketingPageShell'
import { loadAgencyContext } from '@/lib/site/load-agency-context'

export default async function AboutUsPage() {
    const { homepage, capabilities } = await loadAgencyContext()

    return (
        <MarketingPageShell
            page={homepage.page}
            capabilities={capabilities}
            agencyId={homepage.agencyId}
            title="About Us"
            subtitle="Thoughtful travel experiences with clear, specialization-based service delivery."
            heroSize="default"
            heroActions={[
                { label: 'Explore tours', href: '/tours' },
                { label: 'Contact us', href: '/contact-us', variant: 'ghost' },
            ]}
        >
            <AboutPageContent page={homepage.page} />
        </MarketingPageShell>
    )
}
