import ContactUsPage from '@/components/pages/contact/ContactUsPage'
import { buildPageMetadata } from '@/lib/homepage/build-page-metadata'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
    const homepage = await fetchAgencyHomepage()

    return buildPageMetadata({
        pageTitle: 'Get in Touch',
        description:
            'Get in touch with our travel experts for tour packages, custom itineraries, and consultation requests.',
        homepage,
    })
}

export default async function Page() {
    const homepage = await fetchAgencyHomepage()
    return <ContactUsPage page={homepage.page} />
}
