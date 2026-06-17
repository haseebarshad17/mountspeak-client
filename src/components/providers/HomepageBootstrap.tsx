'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

import { getAgencyPreviewHostFromPathname } from '@/lib/homepage/agency-preview'
import { fetchHomepage, resetHomepage } from '@/store/homepage/homepage.slice'
import { selectHomepageStatus } from '@/store/homepage/homepage.selectors'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

export default function HomepageBootstrap() {
    const dispatch = useAppDispatch()
    const status = useAppSelector(selectHomepageStatus)
    const pathname = usePathname()
    const previewHost = getAgencyPreviewHostFromPathname(pathname)
    const previewHostKey = previewHost ?? ''
    const lastPreviewHostKey = useRef<string | null>(null)

    useEffect(() => {
        if (lastPreviewHostKey.current === null) {
            lastPreviewHostKey.current = previewHostKey
            return
        }

        if (lastPreviewHostKey.current !== previewHostKey) {
            lastPreviewHostKey.current = previewHostKey
            dispatch(resetHomepage())
        }
    }, [dispatch, previewHostKey])

    useEffect(() => {
        if (status === 'idle') {
            void dispatch(fetchHomepage())
        }
    }, [dispatch, status, previewHostKey])

    return null
}
