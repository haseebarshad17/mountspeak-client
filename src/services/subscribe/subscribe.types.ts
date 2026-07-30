export type SubscribeStatus = 'SUBSCRIBED'

export type CreateSubscribeDTO = {
    agency_id: string
    email: string
    status: SubscribeStatus
}

export type SubscribeRecord = CreateSubscribeDTO & {
    id?: string
    created_at?: string
}
