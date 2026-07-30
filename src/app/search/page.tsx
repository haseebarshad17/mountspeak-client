import { Suspense } from 'react'
import { SearchPageContent } from '@/components/pages/SearchPageContent'
import { loadAgencyContext } from '@/lib/site/load-agency-context'
import { createServerSupabase } from '@/lib/supabase/supabase.server'
import {
    getDestinationOptions,
    getListingsByKind,
} from '@/services/listings/listings.service'
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

export default async function SearchPage() {
    const { homepage, capabilities } = await loadAgencyContext()
    const agencyId = homepage.agencyId
    const supabase = createServerSupabase()

    const listingsByKind = await loadFullListings(agencyId)
    const destinationsByKind: Record<SpecializationKind, string[]> = {
        tours: isValidAgencyId(agencyId)
            ? await getDestinationOptions({ supabase, agencyId, kind: 'tours' })
            : ['Hunza', 'Skardu', 'Swat', 'Naran', 'Murree'],
        packages: isValidAgencyId(agencyId)
            ? await getDestinationOptions({ supabase, agencyId, kind: 'packages' })
            : ['Makkah', 'Madinah', 'Jeddah'],
        international: isValidAgencyId(agencyId)
            ? await getDestinationOptions({
                  supabase,
                  agencyId,
                  kind: 'international',
              })
            : ['Dubai', 'Turkey', 'Thailand', 'Malaysia', 'Singapore', 'Maldives'],
    }

    return (
        <Suspense fallback={<div className="min-h-screen bg-[#FCF8F3]" />}>
            <SearchPageContent
                page={homepage.page}
                capabilities={capabilities}
                listingsByKind={listingsByKind}
                destinationsByKind={destinationsByKind}
                agencyId={agencyId}
            />
        </Suspense>
    )
}
