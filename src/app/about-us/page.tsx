import AboutUsPage from '@/components/pages/about/AboutUsPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'About Us | Pakistan Travel',
    description:
        'Learn about Pakistan Travel — our mission, values, and commitment to connecting explorers with trusted local tour agencies.',
}

export default function Page() {
    return <AboutUsPage />
}
