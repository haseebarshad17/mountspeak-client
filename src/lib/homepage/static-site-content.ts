import type { Column, Header } from '@/services/homepage/homepage.page.types'

const STATIC_SITE_LINKS = [
    { label: 'Home', href: '/' },
    { label: 'Discover', href: '/discover' },
    { label: 'Tours', href: '/search' },
    { label: 'About Us', href: '/about-us' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact-us' },
] as const

/** Header nav is hardcoded — not managed in agency_site_theme payload. */
export const STATIC_HEADER: Header = {
    navigation: STATIC_SITE_LINKS.filter((link) => link.label !== 'FAQ'),
    auth: {
        login: { label: 'Login', href: '/login' },
        signUp: { label: 'Sign Up', href: '/register' },
        logout: { label: 'Logout' },
    },
    mobileMenu: {
        openLabel: 'Open menu',
        closeLabel: 'Close menu',
        overlayCloseLabel: 'Close menu overlay',
    },
}

const STATIC_LEGAL_LINKS = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
] as const

/** Footer link columns are hardcoded — only Contact comes from payload. */
export function getStaticFooterLinkColumns(): Column[] {
    return [
        {
            title: 'Site Map',
            links: STATIC_SITE_LINKS.map(({ label, href }) => ({
                label,
                href,
            })),
        },
        {
            title: 'Legal',
            links: STATIC_LEGAL_LINKS.map(({ label, href }) => ({
                label,
                href,
            })),
        },
    ]
}
