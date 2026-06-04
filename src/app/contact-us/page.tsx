import ContactUsPage from '@/components/pages/contact/ContactUsPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Contact Us | Pakistan Travel',
    description: 'Get in touch with our travel experts for tour packages, custom itineraries, and consultation requests.',
}

export default function Page() {
    return <ContactUsPage />
}
