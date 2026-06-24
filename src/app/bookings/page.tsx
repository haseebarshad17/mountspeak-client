import BookingsPage from '@/components/pages/dashboard/BookingsPage'
import { buildPageMetadata } from '@/lib/homepage/build-page-metadata'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
    const homepage = await fetchAgencyHomepage()

    return await buildPageMetadata({
        pageTitle: 'Bookings',
        description: 'View upcoming journeys and past expeditions.',
        homepage,
    })
}

const Page = () => {
    return <BookingsPage />
}

export default Page
