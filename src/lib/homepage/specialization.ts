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

export function getTourOrPackageCopy(isUmrahSite: boolean) {
    if (isUmrahSite) {
        return {
            emptyTitle: 'No packages yet',
            emptyHomeDescription: 'Packages will appear here once they are published.',
            emptyPublishedTitle: 'No packages published yet',
            emptyPublishedDescription: 'No published packages yet. Check back soon.',
            viewAllLabel: 'View All Packages',
            loadingLabel: 'Loading packages',
            resultsCountLabel: (count: number) =>
                `${count} package${count === 1 ? '' : 's'} found`,
        } as const
    }

    return {
        emptyTitle: 'No tours yet',
        emptyHomeDescription: null,
        emptyPublishedTitle: 'No tours published yet',
        emptyPublishedDescription: 'No published tours yet. Check back soon for new adventures.',
        viewAllLabel: 'View All Tours',
        loadingLabel: 'Loading tours',
        resultsCountLabel: (count: number) => `${count} tour${count === 1 ? '' : 's'} found`,
    } as const
}
