import BookingPage from '@/components/pages/booking/BookingPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Booking | Pakistan Travel',
    description: 'Begin your journey with us — partner booking and registration.',
}

export default function Page() {
    return <BookingPage />
}
