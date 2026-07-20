import SavedToursPage from '@/components/pages/dashboard/SavedToursPage'
import { buildPageMetadata } from '@/lib/homepage/build-page-metadata'
import { resolveSiteListingCopy } from '@/lib/homepage/specialization'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
    const homepage = await fetchAgencyHomepage()
    const { savedPage } = resolveSiteListingCopy(
        homepage.specializationId,
        homepage.agencySpecializationIds,
        homepage.specializations,
    )

    return await buildPageMetadata({
        pageTitle: savedPage.pageTitle,
        description: savedPage.pageIntro,
        homepage,
    })
}

const Page = () => {
    return <SavedToursPage />
}

export default Page
