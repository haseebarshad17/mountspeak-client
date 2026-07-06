import { cn } from '@/lib/utils/clsxUtils'

export default function BookingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={cn('booking-flow min-h-screen bg-[#fcfcfc] font-body')}>
            {children}
        </div>
    )
}
