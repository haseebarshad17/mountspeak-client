import ResetPasswordPage from '@/components/pages/auth/ResetPasswordPage'
import { buildPageMetadata } from '@/lib/homepage/build-page-metadata'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
    const homepage = await fetchAgencyHomepage()

    return await buildPageMetadata({
        pageTitle: 'Reset Password',
        homepage,
    })
}

const Page = () => {
    return <ResetPasswordPage />
}

export default Page
