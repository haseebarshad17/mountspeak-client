import type { Footer, Login } from '@/services/homepage/homepage.page.types'

export type FooterContactDetails = {
    email: string | null
    phone: string | null
    address: string | null
    emailHref: string | null
    phoneHref: string | null
}

export type FooterContactItem = Login & {
    kind: 'email' | 'phone' | 'location' | 'other'
}

function findContactColumn(footer: Footer) {
    return footer.columns.find((column) => column.title.toLowerCase().includes('contact'))
}

function stripLabelPrefix(label: string, prefix: string): string {
    return label.replace(new RegExp(`^${prefix}\\s*:?\\s*`, 'i'), '').trim()
}

const CONTACT_LABEL_PREFIXES = ['email', 'phone', 'address', 'maps', 'map'] as const

function getContactLabelValue(label: string): string {
    const trimmed = label.trim()
    if (!trimmed) return ''

    for (const prefix of CONTACT_LABEL_PREFIXES) {
        const stripped = stripLabelPrefix(trimmed, prefix)
        if (stripped !== trimmed) return stripped
    }

    return trimmed
}

/** Hide footer/contact rows when the field has no value (empty label line, prefix-only label, etc.). */
export function isFooterContactItemVisible(item: Login): boolean {
    if (getContactLabelValue(item.label ?? '').length > 0) return true
    return Boolean(item.href?.trim())
}

function classifyContactItem(item: Login): FooterContactItem['kind'] {
    const lower = item.label.toLowerCase()

    if (item.href?.toLowerCase().startsWith('mailto:') || lower.startsWith('email')) {
        return 'email'
    }

    if (item.href?.toLowerCase().startsWith('tel:') || lower.startsWith('phone')) {
        return 'phone'
    }

    if (
        lower.startsWith('address') ||
        lower.startsWith('map') ||
        item.href?.toLowerCase().includes('maps.google')
    ) {
        return 'location'
    }

    return 'other'
}

export function getFooterContactColumnItems(footer: Footer): FooterContactItem[] {
    const column = findContactColumn(footer)
    if (!column) return []

    return (column.items ?? column.links ?? [])
        .filter(isFooterContactItemVisible)
        .map((item) => ({
            ...item,
            kind: classifyContactItem(item),
        }))
}

export function getFooterContactDetails(footer: Footer): FooterContactDetails {
    const column = findContactColumn(footer)
    if (!column) {
        return { email: null, phone: null, address: null, emailHref: null, phoneHref: null }
    }

    const items = column.items ?? column.links ?? []
    let email: string | null = null
    let phone: string | null = null
    let emailHref: string | null = null
    let phoneHref: string | null = null
    const addressLines: string[] = []
    let inAddress = false

    for (const item of items) {
        const label = item.label.trim()
        const lower = label.toLowerCase()

        if (item.href?.toLowerCase().startsWith('mailto:')) {
            emailHref = item.href
            email = decodeURIComponent(item.href.replace(/^mailto:/i, ''))
            inAddress = false
            continue
        }

        if (item.href?.toLowerCase().startsWith('tel:')) {
            phoneHref = item.href
            phone = item.href.replace(/^tel:/i, '')
            inAddress = false
            continue
        }

        if (lower.startsWith('email')) {
            email = stripLabelPrefix(label, 'email')
            inAddress = false
            continue
        }

        if (lower.startsWith('phone')) {
            phone = stripLabelPrefix(label, 'phone')
            inAddress = false
            continue
        }

        if (lower.startsWith('map')) {
            inAddress = false
            continue
        }

        if (lower.startsWith('address')) {
            const addressValue = stripLabelPrefix(label, 'address')
            if (addressValue) addressLines.push(addressValue)
            inAddress = true
            continue
        }

        if (inAddress && !item.href && label) {
            addressLines.push(label)
        }
    }

    return {
        email,
        phone,
        address: addressLines.length > 0 ? addressLines.join(', ') : null,
        emailHref,
        phoneHref,
    }
}
