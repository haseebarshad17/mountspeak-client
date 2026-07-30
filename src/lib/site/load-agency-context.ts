import { createServerSupabase } from '@/lib/supabase/supabase.server'
import { getRequestHost } from '@/lib/host/request-host'
import { getAgencyContent } from '@/services/agency/agency.service'
import { getAgencyListingsBundle } from '@/services/listings/listings.service'
import type { ListingItem } from '@/services/listings/listings.types'
import {
    getAgencySpecializationCapabilities,
    isValidAgencyId,
} from '@/services/specialization/specialization.service'
import { getDefaultAgencyCapabilities } from '@/services/specialization/specialization.capabilities'
import type { SpecializationKind } from '@/services/specialization/specialization.types'

export async function loadAgencyContext() {
    const host = await getRequestHost()
    const supabase = createServerSupabase()
    const homepage = await getAgencyContent({ supabase, host })
    const capabilities = isValidAgencyId(homepage.agencyId)
        ? await getAgencySpecializationCapabilities({
              supabase,
              agencyId: homepage.agencyId,
          })
        : getDefaultAgencyCapabilities()

    const listingsByKind: Record<SpecializationKind, ListingItem[]> =
        isValidAgencyId(homepage.agencyId)
            ? await getAgencyListingsBundle({
                  supabase,
                  agencyId: homepage.agencyId,
              })
            : { tours: [], packages: [], international: [] }

    return {
        host,
        homepage,
        capabilities,
        listingsByKind,
    }
}
