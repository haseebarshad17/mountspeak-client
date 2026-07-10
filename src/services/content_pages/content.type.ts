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

export type ContentPagesRow = {
    id: string
    agency_id: string | null
    terms_and_conditions: LegalDocument | null
    privacy_policy: LegalDocument | null
    about_us: unknown | null
    created_at: string
    updated_at: string
}
