import type { Specialization } from '@/services/specializations/specializations.types'

export function resolveSelectedSpecialization(
    specializationId: string | null | undefined,
    specializations: readonly Specialization[],
): Specialization | null {
    if (!specializationId?.trim() || specializations.length === 0) return null

    return specializations.find((row) => row.id === specializationId.trim()) ?? null
}

export function isHajjUmrahSpecializationName(name: string): boolean {
    const normalized = name.trim().toLowerCase()
    return normalized.includes('hajj') || normalized.includes('umrah') || normalized.includes('umra')
}

export function getHajjUmrahSpecializationIds(
    specializations: readonly Specialization[],
): string[] {
    return specializations.filter((row) => isHajjUmrahSpecializationName(row.name)).map((row) => row.id)
}

export function usesHajjUmrahBanner(
    specializationId: string | null | undefined,
    specializations: readonly Specialization[],
): boolean {
    if (!specializationId?.trim() || specializations.length === 0) return false

    const match = specializations.find((row) => row.id === specializationId.trim())
    if (!match) return false

    return isHajjUmrahSpecializationName(match.name)
}
