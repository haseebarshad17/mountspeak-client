import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { getAgencyPreviewHostFromPathname } from '@/lib/homepage/agency-preview'
import type { AgencyHomepage } from '@/services/homepage/homepage.types'

export type HomepageFetchStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export type HomepageState = {
    data: AgencyHomepage | null
    status: HomepageFetchStatus
    error: string | null
}

const initialState: HomepageState = {
    data: null,
    status: 'idle',
    error: null,
}

export const fetchHomepage = createAsyncThunk<AgencyHomepage, void, { rejectValue: string }>(
    'homepage/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const previewHost =
                typeof window !== 'undefined'
                    ? getAgencyPreviewHostFromPathname(window.location.pathname)
                    : null
            const apiUrl = previewHost
                ? `/api/homepage?host=${encodeURIComponent(previewHost)}`
                : '/api/homepage'

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: { Accept: 'application/json' },
            })

            if (!response.ok) {
                const payload = (await response.json().catch(() => null)) as { error?: string } | null
                return rejectWithValue(payload?.error ?? `Request failed (${response.status})`)
            }

            return (await response.json()) as AgencyHomepage
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch homepage')
        }
    },
)

const homepageSlice = createSlice({
    name: 'homepage',
    initialState,
    reducers: {
        resetHomepage: () => initialState,
        hydrateHomepage: (state, action: PayloadAction<AgencyHomepage>) => {
            state.data = action.payload
            state.status = 'succeeded'
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHomepage.pending, (state) => {
                state.error = null
                if (!state.data) {
                    state.status = 'loading'
                }
            })
            .addCase(fetchHomepage.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.data = action.payload
                state.error = null
            })
            .addCase(fetchHomepage.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload ?? action.error.message ?? 'Failed to fetch homepage'
            })
    },
})

export const { resetHomepage, hydrateHomepage } = homepageSlice.actions
export const homepageReducer = homepageSlice.reducer
