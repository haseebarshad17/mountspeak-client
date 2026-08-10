import { LegalDocumentContent } from '@/components/pages/LegalDocumentContent'
import { MarketingPageShell } from '@/components/pages/MarketingPageShell'
import { loadAgencyContext } from '@/lib/site/load-agency-context'

export default async function PrivacyPolicyPage() {
    const { homepage, capabilities } = await loadAgencyContext()
    const document = homepage.page.pages?.privacyPolicy

    return (
        <MarketingPageShell
            page={homepage.page}
            capabilities={capabilities}
            agencyId={homepage.agencyId}
            title={document?.title || 'Privacy Policy'}
            subtitle={
                document?.subtitle ||
                'How we collect, use, and protect your information.'
            }
            heroSize="compact"
            heroActions={[{ label: 'Contact us', href: '/contact-us', variant: 'ghost' }]}
        >
            {document ? <LegalDocumentContent document={document} /> : null}
        </MarketingPageShell>
    )
}
