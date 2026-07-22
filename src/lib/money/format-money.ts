import type { ListingKind } from '@/lib/homepage/specialization'

const DEFAULT_CURRENCY_BY_KIND: Record<ListingKind, string> = {
    tour: 'PKR',
    umrah: 'PKR',
    international: 'USD',
}

export function normalizeCurrencyCode(
    currency?: string | null,
    listingKind: ListingKind = 'tour',
): string {
    const code = currency?.trim().toUpperCase()
    if (code) return code
    return DEFAULT_CURRENCY_BY_KIND[listingKind] ?? 'PKR'
}

/** Formats an amount with its currency code, e.g. `USD 800` or `PKR 25,000`. */
export function formatMoneyAmount(
    amount: number,
    currency?: string | null,
    listingKind: ListingKind = 'tour',
): string {
    const code = normalizeCurrencyCode(currency, listingKind)
    const locale = code === 'PKR' ? 'en-PK' : 'en-US'
    return `${code} ${amount.toLocaleString(locale)}`
}
