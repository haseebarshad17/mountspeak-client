import { back4appFetch } from '@/lib/api/back4app'
import { PAKISTAN_CITIES_FALLBACK } from '@/constants/pakistan-cities'

import type { Back4AppCityListResponse, CityOption } from './cities.types'

const PAKISTAN_WHERE = JSON.stringify({ country: 'Pakistan' })

function uniqueSortedCityNames(cities: CityOption[]): string[] {
    const names = new Set<string>()
    cities.forEach((city) => {
        const trimmed = city.name?.trim()
        if (trimmed) names.add(trimmed)
    })
    return Array.from(names).sort((a, b) => a.localeCompare(b))
}

export async function fetchPakistanCities(): Promise<string[]> {
    try {
        const data = await back4appFetch<Back4AppCityListResponse>('/classes/City', {
            query: {
                where: PAKISTAN_WHERE,
                limit: 10000000,
                keys: 'name,country,location',
                order: 'name',
            },
        })

        const cityNames = uniqueSortedCityNames(
            (data.results ?? []).map((city) => ({
                name: city.name,
                country: city.country,
            })),
        )

        if (cityNames.length > 0) return cityNames

        return [...PAKISTAN_CITIES_FALLBACK]
    } catch {
        return [...PAKISTAN_CITIES_FALLBACK]
    }
}
