import type { Metadata } from 'next'

import DetailPage from '@/components/pages/detail/DetailPage'
import { buildPageMetadata } from '@/lib/homepage/build-page-metadata'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'

export async function generateMetadata(): Promise<Metadata> {
    const homepage = await fetchAgencyHomepage()

    return await buildPageMetadata({
        pageTitle: 'Tour Detail',
        description: 'Detailed itinerary, places, stay and visuals for your selected trip.',
        homepage,
    })
}

export default function Page() {
    return <DetailPage />
}
