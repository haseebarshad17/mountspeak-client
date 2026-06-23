import type { AgencyPaymentAccount } from './agency-payment.types'

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function mapAgencyPaymentAccounts(payment: unknown): AgencyPaymentAccount[] {
    if (!isRecord(payment)) return []

    const accounts = payment.accounts
    if (!Array.isArray(accounts)) return []

    return accounts
        .filter(isRecord)
        .map((item) => ({
            id: String(item.id ?? '').trim(),
            bank: String(item.bank ?? '').trim(),
            type: String(item.type ?? '').trim(),
            value: String(item.value ?? '').trim(),
            account_title: String(item.account_title ?? '').trim() || undefined,
        }))
        .filter((account) => account.bank && account.value)
}
