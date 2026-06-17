import homepageDefaultsDocument from '@/data/homepage-defaults.json'
import type { HomepagePage } from '@/data/homepage'
import type { Footer, Theme } from '@/services/homepage/homepage.page.types'

import { STATIC_FOOTER_LINK_COLUMNS, STATIC_HEADER } from './static-site-content'

const BASE_PAGE = homepageDefaultsDocument.page as HomepagePage

function normalizeTheme(theme?: Partial<Theme>): Theme {
    const apiPrimary = theme?.buttons?.primary
    const fallback = BASE_PAGE.theme.buttons.primary

    return {
        buttons: {
            primary: {
                background: apiPrimary?.background ?? fallback.background,
                backgroundHover: apiPrimary?.backgroundHover ?? fallback.backgroundHover,
                text: apiPrimary?.text ?? fallback.text,
                border: apiPrimary?.border ?? apiPrimary?.background ?? fallback.border,
            },
        },
    }
}

function getContactColumn(footer: Footer) {
    return (
        footer.columns.find((column) => 'items' in column && Array.isArray(column.items)) ??
        BASE_PAGE.footer.columns.find((column) => 'items' in column) ??
        footer.columns[0]
    )
}

function normalizeFooter(footer?: Partial<Footer>): Footer {
    const base = footer ?? BASE_PAGE.footer

    return {
        backgroundColor: base.backgroundColor ?? BASE_PAGE.footer.backgroundColor,
        logo: {
            ...BASE_PAGE.footer.logo,
            ...base.logo,
        },
        columns: [getContactColumn(base as Footer)],
    }
}

export function normalizeHomepagePage(page: HomepagePage): HomepagePage {
    return {
        ...BASE_PAGE,
        ...page,
        seo: { ...BASE_PAGE.seo, ...page.seo },
        theme: normalizeTheme(page.theme),
        branding: {
            ...BASE_PAGE.branding,
            ...page.branding,
            logo: {
                default: { ...BASE_PAGE.branding.logo.default, ...page.branding?.logo?.default },
                onDark: { ...BASE_PAGE.branding.logo.onDark, ...page.branding?.logo?.onDark },
            },
        },
        header: STATIC_HEADER,
        footer: normalizeFooter(page.footer),
        sections: { ...BASE_PAGE.sections, ...page.sections },
    }
}

export function getFooterDisplayColumns(footer: Footer) {
    const contactColumn = getContactColumn(footer)
    return [...STATIC_FOOTER_LINK_COLUMNS, contactColumn]
}
