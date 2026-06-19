'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

import { getAgencyPreviewHostFromPathname } from '@/lib/homepage/agency-preview'
import { fetchHomepage, resetHomepage } from '@/store/homepage/homepage.slice'
import { selectHomepageStatus } from '@/store/homepage/homepage.selectors'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

export default function HomepageBootstrap() {
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const homepageStatus = useAppSelector(selectHomepageStatus)
    const previewHost = getAgencyPreviewHostFromPathname(pathname)
    const previewHostKey = previewHost ?? ''
    const lastPreviewHostKey = useRef<string | null>(null)

    useEffect(() => {
        if (lastPreviewHostKey.current === null) {
            lastPreviewHostKey.current = previewHostKey
            if (homepageStatus !== 'succeeded') {
                void dispatch(fetchHomepage())
            }
            return
        }

        if (lastPreviewHostKey.current !== previewHostKey) {
            lastPreviewHostKey.current = previewHostKey
            dispatch(resetHomepage())
            void dispatch(fetchHomepage())
        }
    }, [dispatch, homepageStatus, previewHostKey])

    useEffect(() => {
        const refetchHomepage = () => {
            void dispatch(fetchHomepage())
        }

        window.addEventListener('focus', refetchHomepage)
        return () => window.removeEventListener('focus', refetchHomepage)
    }, [dispatch])

    return null
}
