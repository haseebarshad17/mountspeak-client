/**
 * Checks which public.bookings columns exist in PostgREST (anon key).
 * Run: node scripts/verify-bookings-schema.mjs
 */
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !key) {
    console.error('Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env')
    process.exit(1)
}

const supabase = createClient(url, key)

/** Columns used by the booking form insert (see CreateTourBookingDTO). */
const columns = [
    'id',
    'tour_id',
    'name',
    'email',
    'phone',
    'emergency_phone',
    'cnic',
    'male_seat',
    'female_seat',
    'kids_seats',
    'amount_total',
    'notes',
    'booking_payment_screenshot',
    'status',
    'agency_id',
    'created_at',
    'updated_at',
]

console.log('public.bookings column probe:\n')

for (const col of columns) {
    const { error } = await supabase.from('bookings').select(col).limit(0)
    if (!error) {
        console.log(`  ${col}: ok`)
    } else if (error.code === '42501') {
        console.log(`  ${col}: exists (RLS blocks anon read)`)
    } else if (error.code === '42703') {
        console.log(`  ${col}: MISSING`)
    } else {
        console.log(`  ${col}: ${error.code} ${error.message}`)
    }
}
