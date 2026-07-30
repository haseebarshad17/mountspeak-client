import { MarketingPageShell } from '@/components/pages/MarketingPageShell'
import { ListingPageContent } from '@/components/pages/ListingPageContent'
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
        >
            <ListingPageContent
                capabilities={capabilities}
                allowedKinds={['packages', 'international']}
                listingsByKind={listingsByKind}
                agencyId={homepage.agencyId}
            />
        </MarketingPageShell>
    )
}
