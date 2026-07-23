import AboutUsPage from '@/components/pages/about/AboutUsPage'
import { buildPageMetadata } from '@/lib/homepage/build-page-metadata'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
    const homepage = await fetchAgencyHomepage()

    return await buildPageMetadata({
        pageTitle: 'About Us',
        description:
            'Learn about our mission, values, and commitment to connecting explorers with trusted local tour agencies.',
        homepage,
    })
}

export default function Page() {
    return <AboutUsPage />
}

