'use client'

import { useRef } from 'react'
import { Provider } from 'react-redux'

import type { AgencyHomepage } from '@/services/homepage/homepage.types'
import { makeStore, type AppStore } from '@/store'
import { hydrateHomepage } from '@/store/homepage/homepage.slice'

type StoreProviderProps = {
    readonly children: React.ReactNode
    readonly initialHomepage?: AgencyHomepage | null
}

export default function StoreProvider({ children, initialHomepage }: StoreProviderProps) {
    const storeRef = useRef<AppStore | null>(null)

    if (!storeRef.current) {
        storeRef.current = makeStore()

        if (initialHomepage) {
            storeRef.current.dispatch(hydrateHomepage(initialHomepage))
        }
    }

    return <Provider store={storeRef.current}>{children}</Provider>
}
