import type { HomepagePage } from '@/data/homepage'
import type { RootState } from '@/store'

export const selectHomepageState = (state: RootState) => state.homepage

export const selectHomepageData = (state: RootState) => state.homepage.data

export const selectHomepageAgencyId = (state: RootState): string | null =>
    state.homepage.data?.agencyId ?? null

export const selectHomepageSiteUrl = (state: RootState): string | null =>
    state.homepage.data?.siteUrl ?? null

export const selectHomepageSpecializationId = (state: RootState): string | null =>
    state.homepage.data?.specializationId ?? null

export const selectHomepageSpecializations = (state: RootState) =>
    state.homepage.data?.specializations ?? []

export const selectHomepageAgencySpecializationIds = (state: RootState): string[] =>
    state.homepage.data?.agencySpecializationIds ?? []

export const selectHomepagePage = (state: RootState): HomepagePage | null =>
    state.homepage.data?.page ?? null

export const selectHomepageThemeUpdatedAt = (state: RootState): string | null =>
    state.homepage.data?.themeUpdatedAt ?? null

export const selectHomepageStatus = (state: RootState) => state.homepage.status

export const selectHomepageError = (state: RootState) => state.homepage.error

export const selectHomepageIsLoading = (state: RootState) =>
    state.homepage.status === 'idle' || state.homepage.status === 'loading'

/** null while homepage is still loading */
export const selectIsAgencySite = (state: RootState): boolean | null => {
    if (state.homepage.status === 'idle' || state.homepage.status === 'loading') {
        return null
    }

    return state.homepage.data?.isAgencySite ?? false
}
