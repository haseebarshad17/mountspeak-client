import { Suspense } from 'react'

import VerifyEmailPage from '@/components/pages/auth/VerifyEmailPage'

export default function Page() {
    return (
        <Suspense fallback={<div className='min-h-dvh bg-white' aria-hidden />}>
            <VerifyEmailPage />
        </Suspense>
    )
}
