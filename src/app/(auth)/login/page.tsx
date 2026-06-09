import { Suspense } from 'react'

import AuthSplitPage from '@/components/pages/auth/AuthSplitPage'
import { redirectIfAuthenticated } from '@/lib/auth/redirect-if-authenticated'

export const dynamic = 'force-dynamic'

export default async function Page() {
    await redirectIfAuthenticated()

    return (
        <Suspense fallback={<div className='min-h-dvh bg-white' aria-hidden />}>
            <AuthSplitPage mode='login' />
        </Suspense>
    )
}
