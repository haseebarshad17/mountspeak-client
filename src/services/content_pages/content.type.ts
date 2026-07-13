export type LegalPageMeta = {
    slug: string
    title: string
    intro: string
    footer_note?: string
    last_updated: string
    agreement_note?: string
    effective_date?: string
}

export type LegalContact = {
    email?: string
    address?: string
    whatsapp?: string
    company_name?: string
    section_title?: string
    support_email?: string
}

export type LegalListSubsection = {
    id: string
    type: 'list'
    title: string
    items: string[]
}

export type LegalCookieType = {
    type: string
    description: string
    can_opt_out?: boolean
}

export type LegalCategory = {
    label: string
    items: string[]
}

export type LegalSection = {
    id: string
    type: string
    title: string
    content?: string
    intro?: string
    paragraphs?: string[]
    items?: string[]
    subsections?: LegalListSubsection[]
    categories?: LegalCategory[]
    contact_note?: string
    cookie_types?: LegalCookieType[]
    meta?: Record<string, string | number>
}

export type LegalDocument = {
    page: LegalPageMeta
    contact?: LegalContact
    sections: LegalSection[]
}

export type AboutUsHero = {
    title: string
    subtitle?: string
    overlay?: boolean
    backgroundImage?: string
}

export type AboutUsMission = {
    title: string
    description: string[]
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

export type AboutUsStatistic = {
    id: number | string
    label: string
    value: string
}

export type AboutUsCompany = {
    title: string
    description: string[]
}

export type AboutUsCtaButton = {
    id: number | string
    url: string
    text: string
    variant?: string
}

export type AboutUsCta = {
    title: string
    subtitle?: string
    buttons?: AboutUsCtaButton[]
}

export type AboutUsDocument = {
    meta?: {
        page?: string
        slug?: string
        title?: string
    }
    hero?: AboutUsHero
    mission?: AboutUsMission
    values?: AboutUsValues
    statistics?: AboutUsStatistic[]
    aboutCompany?: AboutUsCompany
    cta?: AboutUsCta
}

export type ContentPagesRow = {
    id: string
    agency_id: string | null
    terms_and_conditions: LegalDocument | null
    privacy_policy: LegalDocument | null
    about_us: AboutUsDocument | null
    created_at: string
    updated_at: string
}
