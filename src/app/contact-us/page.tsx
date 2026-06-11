import ContactUsPage from '@/components/pages/contact/ContactUsPage'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Contact Us | Pakistan Travel',
    description: 'Get in touch with our travel experts for tour packages, custom itineraries, and consultation requests.',
}

export default async function Page() {
    const homepage = await fetchAgencyHomepage()
    return <ContactUsPage page={homepage.page} />
}
