import { Suspense } from 'react'
import { AccountShell } from '@/components/account/AccountShell'
import { SavedPanel } from '@/components/account/SavedPanel'
import { loadAgencyContext } from '@/lib/site/load-agency-context'

export default async function AccountSavedPage() {
    const { homepage, capabilities } = await loadAgencyContext()

    return (
        <Suspense fallback={<div className="min-h-screen bg-[#FCF8F3]" />}>
            <AccountShell
                page={homepage.page}
                capabilities={capabilities}
                agencyId={homepage.agencyId}
                title="Saved"
                subtitle="Tours and packages you’ve bookmarked for later."
            >
                <SavedPanel agencyId={homepage.agencyId} />
            </AccountShell>
        </Suspense>
    )
}
