import DashboardPage from '@/components/pages/dashboard/DashboardPage'
import { buildPageMetadata } from '@/lib/homepage/build-page-metadata'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
    const homepage = await fetchAgencyHomepage()

    return buildPageMetadata({
        pageTitle: 'Dashboard',
        description: 'Manage your account details, bookings, and upcoming expeditions.',
        homepage,
    })
}

const Page = () => {
    return <DashboardPage />
}

export default Page
