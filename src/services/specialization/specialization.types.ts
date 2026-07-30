export type AgencySpecializationRow = {
    agency_id: string
    specialization_id: string
    created_at: string
}

export type SpecializationRow = {
    id: string
    name: string
    description: string | null
    is_active: boolean
    created_at: string
    updated_at: string
}

export type SpecializationKind = 'tours' | 'packages' | 'international'

export type SpecializationTab = {
    kind: SpecializationKind
    label: string
}

export type AgencySpecializationCapabilities = {
    kinds: SpecializationKind[]
    hasTours: boolean
    hasPackages: boolean
    hasInternational: boolean
    showTabs: boolean
    tabs: SpecializationTab[]
    defaultKind: SpecializationKind
}
