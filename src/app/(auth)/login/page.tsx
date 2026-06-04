import { Suspense } from 'react'

import AuthSplitPage from '@/components/pages/auth/AuthSplitPage'

export default function Page() {
    return (
        <Suspense fallback={<div className='min-h-dvh bg-white' aria-hidden />}>
            <AuthSplitPage mode='login' />
        </Suspense>
    )
}
