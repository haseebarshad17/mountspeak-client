import type { HomepagePage } from '@/data/homepage'
import type { RootState } from '@/store'

export const selectHomepageState = (state: RootState) => state.homepage

export const selectHomepageData = (state: RootState) => state.homepage.data

export const selectHomepagePage = (state: RootState): HomepagePage | null =>
    state.homepage.data?.page ?? null

export const selectHomepageStatus = (state: RootState) => state.homepage.status

export const selectHomepageError = (state: RootState) => state.homepage.error

export const selectHomepageIsLoading = (state: RootState) =>
    state.homepage.status === 'idle' || state.homepage.status === 'loading'
