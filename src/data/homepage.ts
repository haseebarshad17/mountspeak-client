import type { CSSProperties } from 'react'
import homepageDocument from './homepage-content.json'

export type HomepageDocument = typeof homepageDocument
export type HomepagePage = HomepageDocument['page']
export type HomepageTheme = HomepagePage['theme']
export type HomepageSectionKey = keyof HomepagePage['sections']

export const homepage = homepageDocument.page

export function getHomepageThemeCssVars(theme: HomepageTheme = homepage.theme): CSSProperties {
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

export function filterHomepageDestinationCards(activeFilter: string) {
    const { cards } = homepage.sections.popularDestination
    if (activeFilter === 'All') return cards
    return cards.filter((card) => card.region === activeFilter)
}
