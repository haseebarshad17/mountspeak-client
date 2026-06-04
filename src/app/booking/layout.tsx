import { Agdasima, Roboto } from 'next/font/google'
import { cn } from '@/lib/utils/clsxUtils'

const bookingHeading = Agdasima({
    subsets: ['latin'],
    weight: ['400', '700'],
    display: 'swap',
    variable: '--font-booking-heading',
})

const bookingBody = Roboto({
    subsets: ['latin'],
    weight: ['300', '400', '500', '700'],
    display: 'swap',
    variable: '--font-booking-body',
})

export default function BookingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div
            className={cn(
                'booking-flow min-h-screen bg-white font-body',
                bookingHeading.variable,
                bookingBody.variable,
            )}
            style={{
                fontFamily: 'var(--font-booking-body), ui-sans-serif, system-ui, sans-serif',
            }}
        >
            {children}
        </div>
    )
}
