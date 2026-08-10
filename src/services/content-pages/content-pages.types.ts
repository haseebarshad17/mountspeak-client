/** Mirrors `content_pages.about_us` JSON — see agency dashboard CMS. */

export type AboutUsHero = {
    title: string
    subtitle?: string
    backgroundImage?: string
    overlay?: boolean
}

export type AboutUsMission = {
    title: string
    description: string[]
}

export type AboutUsStatistic = {
    id: number | string
    label: string
    value: string
}

export type AboutUsValueItem = {
    id: number | string
    icon?: string
    title: string
    description: string
}

export type AboutUsValues = {
    title: string
    items: AboutUsValueItem[]
}

export type AboutUsCompany = {
    title: string
    description: string[]
}

export type AboutUsCtaButton = {
    id: number | string
    url: string
    text: string
    variant?: 'primary' | 'secondary'
}

export type AboutUsCta = {
    title: string
    subtitle?: string
    buttons: AboutUsCtaButton[]
}

export type AboutUsMeta = {
    page?: string
    slug?: string
    title?: string
    seo?: {
        title?: string
        description?: string
        keywords?: string[]
    }
}

export type AboutUsDocument = {
    hero?: AboutUsHero
    mission?: AboutUsMission
    statistics?: AboutUsStatistic[]
    values?: AboutUsValues
    aboutCompany?: AboutUsCompany
    cta?: AboutUsCta
    meta?: AboutUsMeta
}

export type ContentPagesRow = {
    id: string
    agency_id: string
    terms_and_conditions: unknown
    privacy_policy: unknown
    about_us: AboutUsDocument | null
    created_at?: string
    updated_at?: string
}
