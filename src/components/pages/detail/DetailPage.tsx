import { redirect } from 'next/navigation'

import { DEMO_TOUR_DETAIL_PATH } from '@/lib/tours/default-tour-page'

/** @deprecated Use /details (demo) or /tours/[slug] (live agency site) */
export default function DetailPage(): null {
    redirect(DEMO_TOUR_DETAIL_PATH)
    return null
}
