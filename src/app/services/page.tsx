import { MarketingPageShell } from '@/components/pages/MarketingPageShell'
import { ServicesPageGrid } from '@/components/pages/ServicesPageGrid'
import { loadAgencyContext } from '@/lib/site/load-agency-context'

export default async function ServicesPage() {
    const { homepage, capabilities } = await loadAgencyContext()
    const ourServices = homepage.page.sections?.ourServices

    return (
        <MarketingPageShell
            page={homepage.page}
            capabilities={capabilities}
            agencyId={homepage.agencyId}
            title="Services"
            subtitle="Premium travel services designed around how this agency actually operates."
            heroSize="default"
            heroActions={[
                { label: 'Contact us', href: '/contact-us' },
                { label: 'Browse tours', href: '/tours', variant: 'ghost' },
            ]}
        >
            <ServicesPageGrid data={ourServices} />
        </MarketingPageShell>
    )
}
