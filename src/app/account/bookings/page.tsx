import { Suspense } from 'react'
import { AccountShell } from '@/components/account/AccountShell'
import { BookingsPanel } from '@/components/account/BookingsPanel'
import { loadAgencyContext } from '@/lib/site/load-agency-context'

export default async function AccountBookingsPage() {
    const { homepage, capabilities } = await loadAgencyContext()

    return (
        <Suspense fallback={<div className="site-bg min-h-screen" />}>
            <AccountShell
                page={homepage.page}
                capabilities={capabilities}
                agencyId={homepage.agencyId}
                title="Bookings"
                subtitle="Track upcoming trips and revisit past expeditions."
            >
                <BookingsPanel agencyId={homepage.agencyId} />
            </AccountShell>
        </Suspense>
    )
}
