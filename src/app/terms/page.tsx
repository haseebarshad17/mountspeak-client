import TermsPage from '@/components/pages/terms/TermsPage'
import { buildPageMetadata } from '@/lib/homepage/build-page-metadata'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
    const homepage = await fetchAgencyHomepage()

    return await buildPageMetadata({
        pageTitle: 'Terms & Conditions',
        description:
            'Read our Terms and Conditions before booking your adventure across Pakistan.',
        homepage,
    })
}

export default function Page() {
    return <TermsPage />
}
