import { BookingHeader } from './BookingHeader'

/** Nav background — keep `booking-banner.png` (not partner/marketing hero assets). */
export const BOOKING_HEADER_BG = '/images/pages/booking-banner.png'

export function BookingHeaderSection() {
    return (
        <div
            className='relative isolate min-h-[118px] bg-cover bg-center bg-no-repeat'
            style={{ backgroundImage: `url('${BOOKING_HEADER_BG}')` }}
        >
            <div className='relative z-10'>
                <BookingHeader />
            </div>
        </div>
    )
}
