'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'
import { queryClient } from './query.client'

export default function TanstackQueryProvider({
    children
}: {
    children: ReactNode
}) {
    const [client] = useState(() => queryClient)

    return (
        <QueryClientProvider client={client}>
            {children}
        </QueryClientProvider>
    )
}