import homepageDefaultsDocument from '@/data/homepage-defaults.json'
import type { HomepagePage } from '@/data/homepage'
import type { Footer, FooterSocialLinks, Theme } from '@/services/homepage/homepage.page.types'
import { resolveBlogPostHref } from '@/services/blog/blog.utils'

import { getActiveFooterSocialLinks } from './footer-social'
import { STATIC_HEADER, getStaticFooterLinkColumns } from './static-site-content'

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

function normalizeFooterSocialLinks(incoming?: FooterSocialLinks | null): FooterSocialLinks | undefined {
    const defaults = BASE_PAGE.footer.socialLinks

    const merged: FooterSocialLinks = {
        twitter: incoming?.twitter ?? defaults?.twitter ?? null,
        facebook: incoming?.facebook ?? defaults?.facebook ?? null,
        linkedin: incoming?.linkedin ?? defaults?.linkedin ?? null,
        instagram: incoming?.instagram ?? defaults?.instagram ?? null,
    }

    return getActiveFooterSocialLinks(merged).length > 0 ? merged : undefined
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
        socialLinks: normalizeFooterSocialLinks(base.socialLinks),
    }
}

function normalizePopularTravelBlogs(
    section?: Partial<HomepagePage['sections']['popularTravelBlogs']>,
): HomepagePage['sections']['popularTravelBlogs'] {
    const base = BASE_PAGE.sections.popularTravelBlogs
    const merged = { ...base, ...section }
    const posts = section?.posts ?? base.posts

    return {
        ...merged,
        posts: posts.map((post, index) => ({
            ...(base.posts[index] ?? {}),
            ...post,
            href: resolveBlogPostHref(post.href ?? base.posts[index]?.href),
        })),
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
        sections: {
            ...BASE_PAGE.sections,
            ...page.sections,
            trust: {
                ...BASE_PAGE.sections.trust,
                ...page.sections?.trust,
                brands: page.sections?.trust?.brands ?? [],
            },
            popularTravelBlogs: normalizePopularTravelBlogs(page.sections?.popularTravelBlogs),
        },
    }
}

export function getFooterDisplayColumns() {
    return getStaticFooterLinkColumns()
}
