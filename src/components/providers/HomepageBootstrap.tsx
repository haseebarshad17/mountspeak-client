'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

import { getAgencyPreviewHostFromPathname } from '@/lib/homepage/agency-preview'
import { fetchHomepage, resetHomepage } from '@/store/homepage/homepage.slice'
import { useAppDispatch } from '@/store/hooks'

export default function HomepageBootstrap() {
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const previewHost = getAgencyPreviewHostFromPathname(pathname)
    const previewHostKey = previewHost ?? ''
    const lastPreviewHostKey = useRef<string | null>(null)

    useEffect(() => {
        const previewChanged =
            lastPreviewHostKey.current !== null && lastPreviewHostKey.current !== previewHostKey

        lastPreviewHostKey.current = previewHostKey

        if (previewChanged) {
            dispatch(resetHomepage())
        }

        void dispatch(fetchHomepage())
    }, [dispatch, previewHostKey])

    useEffect(() => {
        const refetchHomepage = () => {
            void dispatch(fetchHomepage())
        }

        window.addEventListener('focus', refetchHomepage)
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                refetchHomepage()
            }
        })

        return () => {
            window.removeEventListener('focus', refetchHomepage)
        }
    }, [dispatch])

    return null
}
