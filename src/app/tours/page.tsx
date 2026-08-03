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

export default async function ToursPage() {
    const { homepage, capabilities } = await loadAgencyContext()
    const listingsByKind = await loadFullListings(homepage.agencyId)

    return (
        <MarketingPageShell
            page={homepage.page}
            title="Tours"
            subtitle="Discover curated local and international journeys tailored to your agency plan."
            capabilities={capabilities}
            agencyId={homepage.agencyId}
            heroSize="default"
            heroActions={[
                { label: 'Search trips', href: '/search' },
                { label: 'Contact us', href: '/contact-us', variant: 'ghost' },
            ]}
        >
            <ListingPageExtras kindLabel="Tours" />
            <ListingPageContent
                capabilities={capabilities}
                allowedKinds={['tours', 'international']}
                listingsByKind={listingsByKind}
                agencyId={homepage.agencyId}
            />
            <ListingPageCta />
        </MarketingPageShell>
    )
}
