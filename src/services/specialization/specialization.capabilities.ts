import type {
    AgencySpecializationCapabilities,
    SpecializationKind,
    SpecializationRow,
} from './specialization.types'

function classifySpecializationKind(name: string): SpecializationKind | null {
    const value = name.toLowerCase()

    if (value.includes('international')) return 'international'
    if (value.includes('hajj') || value.includes('umrah')) return 'packages'
    if (value.includes('domestic') || value.includes('tour')) return 'tours'

    return null
}

export function getSpecializationKinds(
    specializations: SpecializationRow[]
): SpecializationKind[] {
    const set = new Set<SpecializationKind>()

    for (const specialization of specializations) {
        const kind = classifySpecializationKind(specialization.name)
        if (kind) set.add(kind)
    }

    return [...set]
}

/** Demo/fallback when no real agency UUID is available (e.g. localhost defaults). */
export function getDefaultAgencyCapabilities(): AgencySpecializationCapabilities {
    return {
        kinds: ['tours', 'packages', 'international'],
        hasTours: true,
        hasPackages: true,
        hasInternational: true,
        showTabs: true,
        tabs: [
            { kind: 'tours', label: 'Tours' },
            { kind: 'packages', label: 'Packages' },
            { kind: 'international', label: 'International Tours' },
        ],
        defaultKind: 'tours',
    }
}

export function buildAgencyCapabilities(
    specializations: SpecializationRow[]
): AgencySpecializationCapabilities {
    const kinds = getSpecializationKinds(specializations)
    const hasTours = kinds.includes('tours')
    const hasPackages = kinds.includes('packages')
    const hasInternational = kinds.includes('international')

    const tabs = [
        hasTours ? { kind: 'tours', label: 'Tours' as const } : null,
        hasPackages ? { kind: 'packages', label: 'Packages' as const } : null,
        hasInternational
            ? { kind: 'international', label: 'International Tours' as const }
            : null,
    ].filter(Boolean) as AgencySpecializationCapabilities['tabs']

    return {
        kinds,
        hasTours,
        hasPackages,
        hasInternational,
        showTabs: tabs.length > 1,
        tabs,
        defaultKind: tabs[0]?.kind ?? 'tours',
    }
}
