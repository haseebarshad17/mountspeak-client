import { configureStore } from '@reduxjs/toolkit'

import { homepageReducer } from '@/store/homepage/homepage.slice'

export const makeStore = () =>
    configureStore({
        reducer: {
            homepage: homepageReducer,
        },
        devTools: process.env.NODE_ENV !== 'production',
    })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
