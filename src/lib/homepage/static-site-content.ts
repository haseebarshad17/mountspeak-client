import type { Column, Header } from '@/services/homepage/homepage.page.types'

/** Header nav is hardcoded — not managed in agency_site_theme payload. */
export const STATIC_HEADER: Header = {
    navigation: [
        { label: 'Home', href: '/' },
        { label: 'Discover', href: '/discover' },
        { label: 'About Us', href: '/about-us' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Contact', href: '/contact-us' },
    ],
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

/** Footer link columns are hardcoded — only Contact comes from payload. */
export function getStaticFooterLinksColumn(): Column {
    return {
        title: 'Links',
        links: STATIC_HEADER.navigation.map(({ label, href }) => ({
            label,
            href,
        })),
    }
}
