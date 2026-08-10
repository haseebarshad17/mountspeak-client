import { LegalDocumentContent } from '@/components/pages/LegalDocumentContent'
import { MarketingPageShell } from '@/components/pages/MarketingPageShell'
import { loadAgencyContext } from '@/lib/site/load-agency-context'

export default async function TermsOfServicePage() {
    const { homepage, capabilities } = await loadAgencyContext()
    const document = homepage.page.pages?.termsOfService

    return (
        <MarketingPageShell
            page={homepage.page}
            capabilities={capabilities}
            agencyId={homepage.agencyId}
            title={document?.title || 'Terms of Service'}
            subtitle={
                document?.subtitle ||
                'Guidelines for browsing, booking, and requesting travel services.'
            }
            heroSize="compact"
            heroActions={[{ label: 'Contact us', href: '/contact-us', variant: 'ghost' }]}
        >
            {document ? <LegalDocumentContent document={document} /> : null}
        </MarketingPageShell>
    )
}
