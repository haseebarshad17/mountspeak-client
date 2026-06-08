import DiscoverPage from '@/components/pages/discover/DiscoverPage'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Discover | Pakistan Travel',
    description: 'View all travel services offered by our agency — expeditions, itineraries, and expert support across Pakistan.',
}

export default async function Page() {
    const homepage = await fetchAgencyHomepage()
    return <DiscoverPage page={homepage.page} />
}
