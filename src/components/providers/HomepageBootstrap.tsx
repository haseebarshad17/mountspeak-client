'use client'

import { useEffect } from 'react'

import { fetchHomepage } from '@/store/homepage/homepage.slice'
import { selectHomepageStatus } from '@/store/homepage/homepage.selectors'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

export default function HomepageBootstrap() {
    const dispatch = useAppDispatch()
    const status = useAppSelector(selectHomepageStatus)

    useEffect(() => {
        if (status === 'idle') {
            void dispatch(fetchHomepage())
        }
    }, [dispatch, status])

    return null
}
