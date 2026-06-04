import HomePageContent from '@/components/pages/marketing/home/HomePageContent'
import { defaultMeta } from '@/assests/meta'
import { getHomepageMetadata } from '@/lib/homepage/homepage-meta'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'
import { fetchTourLocationOptions } from '@/services/tours/tours.server'
import type { Metadata, Viewport } from 'next'

export async function generateMetadata(): Promise<Metadata> {
    try {
        const agencyHomepage = await fetchAgencyHomepage()
        return getHomepageMetadata(agencyHomepage)
    } catch {
        return defaultMeta
    }
}

export async function generateViewport(): Promise<Viewport> {
    try {
        const agencyHomepage = await fetchAgencyHomepage()
        return {
            themeColor: agencyHomepage.page.seo.themeColor,
        }
    } catch {
        return {
            themeColor: '#003B95',
        }
    }
}

export default async function Page() {
    const tourLocations = await fetchTourLocationOptions()

    return <HomePageContent tourLocations={tourLocations} />
}
