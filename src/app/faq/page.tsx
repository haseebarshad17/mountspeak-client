import { FaqPageContent } from '@/components/pages/FaqPageContent'
import { MarketingPageShell } from '@/components/pages/MarketingPageShell'
import { loadAgencyContext } from '@/lib/site/load-agency-context'
import { createServerSupabase } from '@/lib/supabase/supabase.server'
import { getTravelerFaqs } from '@/services/faqs/faqs.service'

export default async function FaqPage() {
    const { homepage, capabilities } = await loadAgencyContext()
    const items = await getTravelerFaqs({
        supabase: createServerSupabase(),
        agencyId: homepage.agencyId,
    })

    return (
        <MarketingPageShell
            page={homepage.page}
            capabilities={capabilities}
            agencyId={homepage.agencyId}
            title="Frequently asked questions"
            subtitle="Answers about bookings, customization, and trip support."
            heroSize="compact"
            heroActions={[
                { label: 'Contact us', href: '/contact-us' },
                { label: 'Browse tours', href: '/tours', variant: 'ghost' },
            ]}
        >
            <FaqPageContent
                data={{
                    title: 'Frequently asked questions',
                    subtitle: 'Answers about bookings, customization, and trip support.',
                    items,
                }}
            />
        </MarketingPageShell>
    )
}
