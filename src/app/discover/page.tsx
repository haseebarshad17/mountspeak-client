import DiscoverPage from '@/components/pages/discover/DiscoverPage'
import { buildPageMetadata } from '@/lib/homepage/build-page-metadata'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
    const homepage = await fetchAgencyHomepage()

    return buildPageMetadata({
        pageTitle: 'Discover',
        description:
            'View all travel services offered by our agency — expeditions, itineraries, and expert support across Pakistan.',
        homepage,
    })
}

export default async function Page() {
    const homepage = await fetchAgencyHomepage()
    return <DiscoverPage page={homepage.page} />
}
