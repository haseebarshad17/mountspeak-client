import { FaqPageContent } from '@/components/pages/FaqPageContent'
import { MarketingPageShell } from '@/components/pages/MarketingPageShell'
import { loadAgencyContext } from '@/lib/site/load-agency-context'

export default async function FaqPage() {
    const { homepage, capabilities } = await loadAgencyContext()
    const faq = homepage.page.pages?.faq

    return (
        <MarketingPageShell
            page={homepage.page}
            capabilities={capabilities}
            agencyId={homepage.agencyId}
            title={faq?.title || 'FAQ'}
            subtitle={
                faq?.subtitle ||
                'Answers about bookings, customization, and trip support.'
            }
            heroSize="compact"
            heroActions={[
                { label: 'Contact us', href: '/contact-us' },
                { label: 'Browse tours', href: '/tours', variant: 'ghost' },
            ]}
        >
            {faq ? <FaqPageContent data={faq} /> : null}
        </MarketingPageShell>
    )
}
