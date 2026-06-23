export type AgencyPaymentAccount = {
    id: string
    bank: string
    type: string
    value: string
    account_title?: string
}

export type AgencyPaymentPayload = {
    accounts: AgencyPaymentAccount[]
}
