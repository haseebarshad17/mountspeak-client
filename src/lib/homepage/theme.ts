import type { CSSProperties } from 'react'

import type { HomepageTheme } from '@/data/homepage'
import type { HeroSearch, Theme } from '@/services/homepage/homepage.page.types'

/** UI colors that stay hardcoded — only primary comes from payload theme.buttons.primary. */
export const STATIC_UI_COLORS = {
    accent: '#F5D547',
    title: '#14141F',
    text: '#757575',
    textMuted: '#6B7280',
    textBody: '#4B5563',
    textNeutral: '#9CA3AF',
    textOnDark: '#FFFFFF',
    textOnDarkMuted: 'rgba(255,255,255,0.9)',
    titleOnDark: '#FFFFFF',
    heroTitle: '#FFFFFF',
    heroText: '#FFFFFF',
    cardTitle: '#111827',
    quoteBackground: '#F2F2F2',
    borderLight: '#E5E7EB',
    avatarBadge: '#FF7875',
    backgroundMuted: '#F2F2F2',
    error: '#ffb4b4',
} as const

/** Book-a-tour CTA — always static light button, not from API theme. */
export const STATIC_LIGHT_BUTTON = {
    background: '#F2F2F2',
    backgroundHover: '#FFFFFF',
    text: '#276968',
} as const

const DEFAULT_PRIMARY: HeroSearch = {
    background: '#276968',
    backgroundHover: '#1f5453',
    text: '#FFFFFF',
    border: '#276968',
}

export type ResolvedThemeButtons = {
    primary: HeroSearch
    primaryRounded: HeroSearch
    outline: HeroSearch
    heroSearch: HeroSearch
    navCta: HeroSearch
}

export const HP_CSS_VARS = {
    primary: 'var(--hp-color-primary)',
    primaryHover: 'var(--hp-color-primary-hover)',
    primaryText: 'var(--hp-color-primary-text)',
    primaryBorder: 'var(--hp-color-primary-border)',
    eyebrow: 'var(--hp-color-eyebrow)',
} as const

/** Apply to buttons that use API primary colors (includes hover). */
export const HP_THEME_BTN_CLASS =
    'hp-theme-btn hover:!bg-[var(--hp-color-primary-hover)] focus-visible:!bg-[var(--hp-color-primary-hover)]'

/** Optional extra inline styles — bg/hover handled by HP_THEME_BTN_CLASS (!important). */
export const HP_THEME_BTN_STYLE: CSSProperties = {}

/** Outline buttons — white bg, primary text, border = API primary background. */
export const HP_THEME_OUTLINE_BTN_CLASS = 'hp-theme-outline-btn'

/** Light buttons on dark sections — theme primary background as text color. */
export const HP_THEME_LIGHT_BTN_CLASS = 'hp-theme-light-btn'

export const HP_OUTLINE_BTN_STYLE: CSSProperties = {
    backgroundColor: '#FFFFFF',
    borderColor: HP_CSS_VARS.primary,
    color: HP_CSS_VARS.primary,
}

/** Text, links, tabs, and inputs that should follow agency primary color. */
export const HP_THEME_TEXT_CLASS = 'text-[var(--hp-color-primary)]'
export const HP_THEME_BG_CLASS = 'bg-[var(--hp-color-primary)]'
export const HP_THEME_BORDER_CLASS = 'border-[var(--hp-color-primary)]'
export const HP_THEME_LINK_CLASS =
    'text-[var(--hp-color-primary)] transition hover:text-[var(--hp-color-primary-hover)]'
export const HP_THEME_TAB_ACTIVE_CLASS = 'text-[var(--hp-color-primary)]'
export const HP_THEME_TAB_INACTIVE_CLASS = 'text-[#8a8f95]'
export const HP_THEME_TAB_INDICATOR_CLASS = 'bg-[var(--hp-color-primary)]'
export const HP_THEME_INPUT_FOCUS_CLASS = 'focus:border-[var(--hp-color-primary)]'
export const HP_THEME_ICON_BTN_CLASS = 'hp-theme-btn'

export function resolveThemeButtons(theme: Theme): ResolvedThemeButtons {
    const primary = { ...DEFAULT_PRIMARY, ...theme.buttons.primary }

    return {
        primary,
        primaryRounded: primary,
        outline: {
            background: '#FFFFFF',
            backgroundHover: '#F9FAFB',
            text: primary.background,
            border: primary.background,
        },
        heroSearch: primary,
        navCta: primary,
    }
}

/** Primary button colors from API; eyebrow and accents use primary.background. */
export function getHomepageThemeCssVars(theme: HomepageTheme): CSSProperties {
    const { primary } = resolveThemeButtons(theme)

    return {
        '--hp-color-primary': primary.background,
        '--hp-color-primary-hover': primary.backgroundHover,
        '--hp-color-primary-text': primary.text,
        '--hp-color-primary-border': primary.border ?? primary.background,
        '--hp-color-eyebrow': primary.background,
        '--hp-font-heading': 'var(--font-jost), ui-sans-serif, system-ui, sans-serif',
        '--hp-font-body': 'var(--font-roboto), ui-sans-serif, system-ui, sans-serif',
    } as CSSProperties
}
