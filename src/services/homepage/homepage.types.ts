import type { HomepagePage } from '@/data/homepage'

export type AgencySiteThemeRow = {
    id?: string
    agency_id: string
    site_url: string | null
    theme: unknown
    created_at?: string
    updated_at?: string
}

/** @deprecated Use AgencySiteThemeRow */
export type AgencySiteRow = AgencySiteThemeRow

export type AgencyHomepage = {
    agencyId: string
    siteUrl: string | null
    page: HomepagePage
}
