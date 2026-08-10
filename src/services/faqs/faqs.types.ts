export type FaqAudience = 'travelers' | 'agencies'

export type FaqRow = {
    id: string
    agency_id: string
    question: string
    answer: string
    type: string
    created_at?: string
    updated_at?: string
}

export type FaqItem = {
    id: string
    question: string
    answer: string
}
