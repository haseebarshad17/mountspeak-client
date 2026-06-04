import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

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
            const response = await fetch('/api/homepage', {
                method: 'GET',
                headers: { Accept: 'application/json' },
                cache: 'no-store',
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
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHomepage.pending, (state) => {
                state.status = 'loading'
                state.error = null
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

export const { resetHomepage } = homepageSlice.actions
export const homepageReducer = homepageSlice.reducer
