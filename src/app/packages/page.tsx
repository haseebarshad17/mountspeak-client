import { MarketingPageShell } from '@/components/pages/MarketingPageShell'
import { ListingPageContent } from '@/components/pages/ListingPageContent'
import {
    ListingPageCta,
    ListingPageExtras,
} from '@/components/pages/ListingPageExtras'
import { loadAgencyContext } from '@/lib/site/load-agency-context'
import { createServerSupabase } from '@/lib/supabase/supabase.server'
import { getListingsByKind } from '@/services/listings/listings.service'
import { isValidAgencyId } from '@/services/specialization/specialization.service'
import type { ListingItem } from '@/services/listings/listings.types'
import type { SpecializationKind } from '@/services/specialization/specialization.types'

async function loadFullListings(agencyId: string) {
    const empty: Record<SpecializationKind, ListingItem[]> = {
        tours: [],
        packages: [],
        international: [],
    }
    if (!isValidAgencyId(agencyId)) return empty

    const supabase = createServerSupabase()
    const [tours, packages, international] = await Promise.all([
        getListingsByKind({ supabase, agencyId, kind: 'tours' }),
        getListingsByKind({ supabase, agencyId, kind: 'packages' }),
        getListingsByKind({ supabase, agencyId, kind: 'international' }),
    ])
    return { tours, packages, international }
}

export default async function PackagesPage() {
    const { homepage, capabilities } = await loadAgencyContext()
    const listingsByKind = await loadFullListings(homepage.agencyId)

    return (
        <MarketingPageShell
            page={homepage.page}
            title="Packages"
            subtitle="View package offers based on your agency specialization profile."
            capabilities={capabilities}
            agencyId={homepage.agencyId}
            heroSize="default"
            heroActions={[
                { label: 'Search packages', href: '/search?kind=packages' },
                { label: 'Contact us', href: '/contact-us', variant: 'ghost' },
            ]}
        >
            <ListingPageExtras kindLabel="Packages" />
            <ListingPageContent
                capabilities={capabilities}
                allowedKinds={['packages']}
                listingsByKind={listingsByKind}
                agencyId={homepage.agencyId}
            />
            <ListingPageCta />
        </MarketingPageShell>
    )
}
