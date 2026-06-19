export const FAQ_TYPE_TRAVELERS = 'travelers' as const

export type FaqType = typeof FAQ_TYPE_TRAVELERS | 'tour_operators'

export type FaqRow = {
    id: string
    agency_id: string
    question: string
    answer: string
    type: FaqType
    created_at: string
    updated_at: string
}
