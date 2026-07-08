import type { BookingRequestCategory } from '@/services/booking-requests/booking-requests.types'

export const UMRAH_BOOKING_DESTINATIONS = ['Jeddah', 'Makkah', 'Madina', 'Riyadh'] as const

export const UMRAH_BOOKING_EXCLUDED_CATEGORIES: BookingRequestCategory[] = [
    'ADVENTURE',
    'HONEYMOON',
]
