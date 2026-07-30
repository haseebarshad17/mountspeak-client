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
            subtitle="Minimal contact flow for inquiries and booking assistance."
        >
            <ContactPageContent />
        </MarketingPageShell>
    )
}
