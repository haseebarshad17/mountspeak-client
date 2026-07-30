import type { SupabaseClient } from '@supabase/supabase-js'
import { isValidAgencyId } from '@/services/specialization/specialization.service'
import { partitionBookings } from './user-bookings.utils'
import type { UserBookingRow, UserBookingsResult } from './user-bookings.types'

const USER_BOOKINGS_SELECT = `
  id,
  status,
  created_at,
  male_seat,
  female_seat,
  kids_seats,
  booking_payment_screenshot,
  payment_id,
  payment:payments (
    status
  ),
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

export function userBookingsService({ supabase }: { supabase: SupabaseClient }) {
    return {
        async fetchUserBookings({
            email,
            agencyId,
        }: {
            email: string
            agencyId?: string
        }): Promise<UserBookingsResult> {
            const normalizedEmail = email.trim().toLowerCase()
            if (!normalizedEmail) return { upcoming: [], past: [] }

            let query = supabase
                .from('bookings')
                .select(USER_BOOKINGS_SELECT)
                .ilike('email', normalizedEmail)

            if (agencyId && isValidAgencyId(agencyId)) {
                query = query.eq('agency_id', agencyId)
            }

            const { data, error } = await query.order('created_at', {
                ascending: false,
            })

            if (error) throw error
            return partitionBookings((data as UserBookingRow[] | null) ?? [])
        },
    }
}

export async function getUserBookings({
    supabase,
    email,
    agencyId,
}: {
    supabase: SupabaseClient
    email: string
    agencyId?: string
}) {
    try {
        return await userBookingsService({ supabase }).fetchUserBookings({
            email,
            agencyId,
        })
    } catch {
        return { upcoming: [], past: [] }
    }
}
