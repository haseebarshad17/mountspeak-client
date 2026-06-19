import type { SupabaseClient } from '@supabase/supabase-js'

import { toApiError } from '@/lib/api/errors'
import { MessageCode } from '@/lib/messages/codes'

import { partitionBookings } from './user-bookings.utils'

import type { UserBookingRow } from './user-bookings.types'

const USER_BOOKINGS_SELECT = `
  id,
  status,
  created_at,
  male_seat,
  female_seat,
  kids_seats,
  booking_payment_screenshot,
  tours (
    id,
    slug,
    title,
    from_location,
    to_location,
    start_date,
    end_date,
    header,
    overview,
    visual_fragments
  )
`

type UserBookingsServiceProps = {
    supabase: SupabaseClient
}

export const userBookingsService = ({ supabase }: UserBookingsServiceProps) => {
    return {
        fetchUserBookings: async (email: string) => {
            const normalizedEmail = email.trim().toLowerCase()
            if (!normalizedEmail) {
                return { upcoming: [], past: [], hasLiveData: false }
            }

            const { data, error } = await supabase
                .from('bookings')
                .select(USER_BOOKINGS_SELECT)
                .ilike('email', normalizedEmail)
                .order('created_at', { ascending: false })

            if (error) {
                throw toApiError(error, MessageCode.API_BOOKINGS_LOAD_FAILED)
            }

            const rows = (data ?? []) as UserBookingRow[]
            const { upcoming, past } = partitionBookings(rows)

            return {
                upcoming,
                past,
                hasLiveData: rows.length > 0,
            }
        },
    }
}
