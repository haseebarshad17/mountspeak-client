import TermsPage from '@/components/pages/terms/TermsPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Terms & Privacy Policy | Pakistan Travel',
    description:
        'Read our Terms and Conditions and Privacy Policy before booking your adventure across Pakistan.',
}

export default function Page() {
    return <TermsPage />
}
