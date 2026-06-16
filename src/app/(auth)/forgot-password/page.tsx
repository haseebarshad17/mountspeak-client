import ForgotPasswordPage from '@/components/pages/auth/ForgotPasswordPage'
import { buildPageMetadata } from '@/lib/homepage/build-page-metadata'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
    const homepage = await fetchAgencyHomepage()

    return buildPageMetadata({
        pageTitle: 'Forgot Password',
        homepage,
    })
}

const Page = () => {
    return <ForgotPasswordPage />
}

export default Page
