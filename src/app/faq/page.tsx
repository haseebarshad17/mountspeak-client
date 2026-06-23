import FaqPage from '@/components/pages/faq/FaqPage'
import { buildPageMetadata } from '@/lib/homepage/build-page-metadata'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
    const homepage = await fetchAgencyHomepage()

    return buildPageMetadata({
        pageTitle: 'FAQ',
        description:
            'Find answers to common questions about tour packages, bookings, payments, and trip planning.',
        homepage,
    })
}

export default function Page() {
    return <FaqPage />
}
