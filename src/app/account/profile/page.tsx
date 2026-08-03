import { Suspense } from 'react'
import { AccountShell } from '@/components/account/AccountShell'
import { ProfilePanel } from '@/components/account/ProfilePanel'
import { loadAgencyContext } from '@/lib/site/load-agency-context'

export default async function AccountProfilePage() {
    const { homepage, capabilities } = await loadAgencyContext()

    return (
        <Suspense fallback={<div className="site-bg min-h-screen" />}>
            <AccountShell
                page={homepage.page}
                capabilities={capabilities}
                agencyId={homepage.agencyId}
                title="Profile"
                subtitle="Manage your personal details used across bookings and enquiries."
            >
                <ProfilePanel />
            </AccountShell>
        </Suspense>
    )
}
