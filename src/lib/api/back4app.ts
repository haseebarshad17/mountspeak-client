import { getBack4AppEnv } from '@/env/back4app'

import { ApiError } from './errors'

const BACK4APP_API_BASE = 'https://parseapi.back4app.com'

type Back4AppFetchOptions = {
    query?: Record<string, string | number | boolean | undefined>
}

export async function back4appFetch<T>(
    path: string,
    options: Back4AppFetchOptions = {},
): Promise<T> {
    const url = new URL(`${BACK4APP_API_BASE}${path.startsWith('/') ? path : `/${path}`}`)

    if (options.query) {
        Object.entries(options.query).forEach(([key, value]) => {
            if (value !== undefined) {
                url.searchParams.set(key, String(value))
            }
        })
    }

    const { back4appApplicationId, back4appMasterKey } = getBack4AppEnv()

    const response = await fetch(url.toString(), {
        headers: {
            'X-Parse-Application-Id': back4appApplicationId,
            'X-Parse-Master-Key': back4appMasterKey,
        },
        next: { revalidate: 60 * 60 * 24 },
    })

    if (!response.ok) {
        let message = `Back4App request failed (${response.status})`
        try {
            const payload = (await response.json()) as { error?: string }
            if (payload.error) message = payload.error
        } catch {
            // ignore
        }
        throw new ApiError(message, String(response.status))
    }

    return (await response.json()) as T
}
