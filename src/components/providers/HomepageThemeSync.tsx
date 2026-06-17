'use client'

import { useEffect } from 'react'

import { getHomepageThemeCssVars } from '@/data/homepage'
import { useHomepagePageWithFallback } from '@/hooks/useHomepagePageWithFallback'
import {
    selectHomepageData,
    selectHomepageIsLoading,
    selectHomepagePage,
} from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'

export default function HomepageThemeSync() {
    const page = useHomepagePageWithFallback()
    const pageFromStore = useAppSelector(selectHomepagePage)
    const homepageData = useAppSelector(selectHomepageData)
    const isLoading = useAppSelector(selectHomepageIsLoading)

    useEffect(() => {
        if (!page) return

        const source = pageFromStore ? 'api' : 'dummy-fallback'
        const { primary } = page.theme.buttons

        console.log('[HomepageTheme] Theme source:', source, {
            isAgencySite: homepageData?.isAgencySite ?? false,
            siteUrl: homepageData?.siteUrl ?? null,
            agencyId: homepageData?.agencyId ?? null,
        })
        console.log('[HomepageTheme] API primary color:', {
            background: primary.background,
            backgroundHover: primary.backgroundHover,
            text: primary.text,
            border: primary.border,
        })

        const vars = getHomepageThemeCssVars(page.theme) as Record<string, string>
        console.log('[HomepageTheme] Applied CSS vars:', {
            '--hp-color-primary': vars['--hp-color-primary'],
            '--hp-color-primary-hover': vars['--hp-color-primary-hover'],
            '--hp-color-primary-text': vars['--hp-color-primary-text'],
            '--hp-color-primary-border': vars['--hp-color-primary-border'],
            '--hp-color-eyebrow': vars['--hp-color-eyebrow'],
        })

        if (source === 'dummy-fallback' && !isLoading) {
            console.warn(
                '[HomepageTheme] Using local defaults — no agency_site_theme row matched this host. Check dashboard Public site URL matches your dev URL.',
            )
        }

        const body = document.body

        Object.entries(vars).forEach(([key, value]) => {
            if (value !== undefined) {
                body.style.setProperty(key, String(value))
            }
        })
    }, [page, pageFromStore, homepageData, isLoading])

    return null
}
