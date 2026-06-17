import type {
    HomepageDocument,
    Page as HomepagePage,
    Sections,
    Theme as HomepageTheme,
} from '@/services/homepage/homepage.page.types'

export type { HomepageDocument, HomepagePage, HomepageTheme }

export type HomepageSectionKey = keyof Sections

export type HomepageContentSchema = HomepageDocument

export {
    getHomepageThemeCssVars,
    HP_CSS_VARS,
    HP_THEME_BTN_CLASS,
    HP_THEME_BTN_STYLE,
    HP_THEME_OUTLINE_BTN_CLASS,
    HP_OUTLINE_BTN_STYLE,
    resolveThemeButtons,
    STATIC_UI_COLORS,
    STATIC_LIGHT_BUTTON,
    type ResolvedThemeButtons,
} from '@/lib/homepage/theme'

export function filterHomepageDestinationCards(
    page: HomepagePage,
    activeFilter: string,
) {
    const { cards } = page.sections.popularDestination
    if (activeFilter === 'All') return cards
    return cards.filter((card) => card.region === activeFilter)
}
