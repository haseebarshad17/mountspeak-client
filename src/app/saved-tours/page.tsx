import SavedToursPage from '@/components/pages/dashboard/SavedToursPage'
import { buildPageMetadata } from '@/lib/homepage/build-page-metadata'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
    const homepage = await fetchAgencyHomepage()

    return await buildPageMetadata({
        pageTitle: 'Saved Tours',
        description: 'View tours you have saved for later.',
        homepage,
    })
}

const Page = () => {
    return <SavedToursPage />
}

export default Page
