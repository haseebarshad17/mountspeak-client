import HomePageContent from '@/components/pages/marketing/home/HomePageContent'
import { buildPlatformMetadata } from '@/assests/meta'
import { getHomepageMetadata } from '@/lib/homepage/homepage-meta'
import { getRequestSiteUrl } from '@/lib/homepage/resolve-request-host'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'
import { fetchTourLocationOptions } from '@/services/tours/tours.server'
import type { Metadata, Viewport } from 'next'

export async function generateMetadata(): Promise<Metadata> {
    const agencyHomepage = await fetchAgencyHomepage()

    try {
        return getHomepageMetadata(agencyHomepage)
    } catch {
        return buildPlatformMetadata(await getRequestSiteUrl())
    }
}

export async function generateViewport(): Promise<Viewport> {

    const agencyHomepage = await fetchAgencyHomepage()

    return {
        themeColor: agencyHomepage.page.seo.themeColor,
    }
}

export default async function Page() {
    const tourLocations = await fetchTourLocationOptions()

    return <HomePageContent tourLocations={tourLocations} />
}
