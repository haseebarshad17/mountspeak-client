'use client'

import { useEffect } from 'react'

import { getHomepageThemeCssVars } from '@/data/homepage'
import { selectHomepagePage } from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'

export default function HomepageThemeSync() {
    const page = useAppSelector(selectHomepagePage)

    useEffect(() => {
        if (!page) return

        const vars = getHomepageThemeCssVars(page.theme)
        const body = document.body

        Object.entries(vars).forEach(([key, value]) => {
            if (value !== undefined) {
                body.style.setProperty(key, String(value))
            }
        })
    }, [page])

    return null
}
