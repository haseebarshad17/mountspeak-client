import type { BookingTourOption } from '@/components/pages/booking/booking.types'
import { DEFAULT_AGENCY_ID } from '@/lib/homepage/default-homepage'

const DEMO_TOUR_ID = '00000000-0000-0000-0000-000000000001'
const DEMO_SLOT_ID = '00000000-0000-0000-0000-000000000101'

function futureIsoDate(daysFromNow: number): string {
    const date = new Date()
    date.setDate(date.getDate() + daysFromNow)
    return date.toISOString().slice(0, 10)
}

/** Static tour used only for booking form preview on unconfigured demo hosts. */
export const DEMO_BOOKING_TOUR_OPTION: BookingTourOption = {
    id: DEMO_TOUR_ID,
    slug: 'sample-expedition',
    title: 'Sample Expedition (Preview)',
    agencyId: DEFAULT_AGENCY_ID,
    pricePerSeat: 25000,
    advanceAmountPerSeat: 5000,
    discountPercent: 10,
    kidsDiscountPercent: 5,
    startDate: futureIsoDate(30),
    capacityTotal: 20,
    confirmedSeats: 0,
    availableSeats: 20,
    isBookingClosed: false,
    slots: [
        {
            id: DEMO_SLOT_ID,
            startDate: futureIsoDate(30),
            endDate: futureIsoDate(33),
            startTime: '06:00',
            endTime: '18:00',
            capacityTotal: 20,
            confirmedSeats: 5,
            availableSeats: 15,
            isBookable: true,
            label: 'Sample departure',
        },
    ],
}
