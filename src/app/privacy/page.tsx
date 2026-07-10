import PrivacyPage from '@/components/pages/privacy/PrivacyPage'
import { buildPageMetadata } from '@/lib/homepage/build-page-metadata'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
    const homepage = await fetchAgencyHomepage()

    return await buildPageMetadata({
        pageTitle: 'Privacy Policy',
        description:
            'Learn how we collect, use, and protect your personal information when you use our platform.',
        homepage,
    })
}

export default function Page() {
    return <PrivacyPage />
}
