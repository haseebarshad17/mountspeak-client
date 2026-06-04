import type { CSSProperties } from 'react'

import type {
    HomepageDocument,
    Page as HomepagePage,
    Sections,
    Theme as HomepageTheme,
} from '@/services/homepage/homepage.page.types'

export type { HomepageDocument, HomepagePage, HomepageTheme }

export type HomepageSectionKey = keyof Sections

export type HomepageContentSchema = HomepageDocument

export function getHomepageThemeCssVars(theme: HomepageTheme): CSSProperties {
    const { colors } = theme
    return {
        '--hp-color-primary': colors.primary,
        '--hp-color-primary-hover': colors.primaryHover,
        '--hp-color-accent': colors.accent,
        '--hp-color-title': colors.title,
        '--hp-color-text': colors.text,
        '--hp-color-eyebrow': colors.eyebrow,
        '--hp-color-background-muted': colors.backgroundMuted,
        '--hp-font-heading': `var(${theme.fonts.heading.cssVariable}), ${theme.fonts.heading.fallback}`,
        '--hp-font-body': `var(${theme.fonts.body.cssVariable}), ${theme.fonts.body.fallback}`,
    } as CSSProperties
}

export function filterHomepageDestinationCards(
    page: HomepagePage,
    activeFilter: string,
) {
    const { cards } = page.sections.popularDestination
    if (activeFilter === 'All') return cards
    return cards.filter((card) => card.region === activeFilter)
}
