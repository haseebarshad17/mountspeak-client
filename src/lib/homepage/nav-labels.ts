const CONTACT_NAV_PATHS = new Set(['/contact-us', '/contact'])

export function resolveNavLinkDisplayLabel(
    label: string,
    href: string | null | undefined,
): string {
    const normalizedHref = href?.trim().replace(/\/$/, '') || '/'

    if (CONTACT_NAV_PATHS.has(normalizedHref)) {
        return 'Contact Us'
    }

    return label
}
