export type PlanIntervalEnum = 'monthly' | 'yearly'

export type PlanType = {
    id: string
    name: string
    slug: string
    price: number
    interval: PlanIntervalEnum
    websites_limit: number
    domains_limit: number
    features: string[]
    is_active: boolean
}