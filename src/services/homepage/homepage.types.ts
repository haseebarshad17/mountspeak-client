import type { HomepagePage } from '@/data/homepage'
import type { Specialization } from '@/services/specializations/specializations.types'

export type AgencySiteThemeRow = {
    id?: string
    agency_id: string
    site_url: string | null
    theme: unknown
    specialization_id?: string | null
    created_at?: string
    updated_at?: string
}

/** @deprecated Use AgencySiteThemeRow */
export type AgencySiteRow = AgencySiteThemeRow

export type AgencyHomepage = {
    agencyId: string
    siteUrl: string | null
    /** From agency_site_theme.specialization_id */
    specializationId: string | null
    /** All options from `specializations` table (for banner + UI). */
    specializations: Specialization[]
    /** True when request host matches a configured agency_site_theme.site_url */
    isAgencySite: boolean
    page: HomepagePage
}
