import { MarketingPageShell } from '@/components/pages/MarketingPageShell'
import { ContactPageContent } from '@/components/pages/ContactPageContent'
import { loadAgencyContext } from '@/lib/site/load-agency-context'

export default async function ContactUsPage() {
    const { homepage, capabilities } = await loadAgencyContext()

    return (
        <MarketingPageShell
            page={homepage.page}
            capabilities={capabilities}
            agencyId={homepage.agencyId}
            title="Contact Us"
            subtitle="Reach the team for inquiries, custom plans, and booking assistance."
            heroSize="default"
            heroActions={[
                { label: 'View tours', href: '/tours', variant: 'ghost' },
            ]}
        >
            <ContactPageContent page={homepage.page} />
        </MarketingPageShell>
    )
}
