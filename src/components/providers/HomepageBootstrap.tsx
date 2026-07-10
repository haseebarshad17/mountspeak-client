'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

import { getAgencyPreviewHostFromPathname } from '@/lib/homepage/agency-preview'
import { fetchHomepage, resetHomepage } from '@/store/homepage/homepage.slice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

const FOCUS_REFETCH_MS = 120_000

export default function HomepageBootstrap() {
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const homepageStatus = useAppSelector((state) => state.homepage.status)
    const previewHost = getAgencyPreviewHostFromPathname(pathname)
    const previewHostKey = previewHost ?? ''
    const lastPreviewHostKey = useRef<string | null>(null)
    const lastFetchedAt = useRef(0)

    useEffect(() => {
        const previewChanged =
            lastPreviewHostKey.current !== null && lastPreviewHostKey.current !== previewHostKey

        lastPreviewHostKey.current = previewHostKey

        if (previewChanged) {
            dispatch(resetHomepage())
            lastFetchedAt.current = Date.now()
            void dispatch(fetchHomepage())
            return
        }

        if (homepageStatus === 'idle') {
            lastFetchedAt.current = Date.now()
            void dispatch(fetchHomepage())
        }
    }, [dispatch, homepageStatus, previewHostKey])

    useEffect(() => {
        const refetchHomepage = () => {
            if (Date.now() - lastFetchedAt.current < FOCUS_REFETCH_MS) return
            lastFetchedAt.current = Date.now()
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
