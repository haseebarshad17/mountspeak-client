import { HomePage } from '@/components/home/HomePage'
import { loadAgencyContext } from '@/lib/site/load-agency-context'
import { createServerSupabase } from '@/lib/supabase/supabase.server'
import { getDestinationOptions } from '@/services/listings/listings.service'
import { isValidAgencyId } from '@/services/specialization/specialization.service'
import type { SpecializationKind } from '@/services/specialization/specialization.types'

function isLocalHost(host: string) {
    return host.startsWith('localhost') || host.startsWith('127.0.0.1')
}

export default async function Page() {
    const { homepage, capabilities, listingsByKind, host } = await loadAgencyContext()
    const supabase = createServerSupabase()
    const agencyId = homepage.agencyId

    const destinationsByKind: Record<SpecializationKind, string[]> = {
        tours: [],
        packages: [],
        international: [],
    }

    if (isValidAgencyId(agencyId)) {
        const [tours, packages, international] = await Promise.all([
            getDestinationOptions({ supabase, agencyId, kind: 'tours' }),
            getDestinationOptions({ supabase, agencyId, kind: 'packages' }),
            getDestinationOptions({ supabase, agencyId, kind: 'international' }),
        ])
        destinationsByKind.tours = tours
        destinationsByKind.packages = packages
        destinationsByKind.international = international
    } else {
        destinationsByKind.tours = ['Hunza', 'Skardu', 'Swat', 'Naran', 'Murree']
        destinationsByKind.packages = ['Makkah', 'Madinah', 'Jeddah']
        destinationsByKind.international = [
            'Dubai',
            'Turkey',
            'Thailand',
            'Malaysia',
            'Singapore',
            'Maldives',
        ]
    }

    return (
        <HomePage
            page={homepage.page}
            capabilities={capabilities}
            listingsByKind={listingsByKind}
            destinationsByKind={destinationsByKind}
            agencyId={agencyId}
            previewHost={isLocalHost(host) ? null : host}
        />
    )
}
