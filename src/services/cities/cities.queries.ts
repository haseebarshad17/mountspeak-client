import { useQuery } from '@tanstack/react-query'

import { PAKISTAN_CITIES_FALLBACK } from '@/constants/pakistan-cities'

async function fetchPakistanCitiesFromApi(): Promise<string[]> {
    const response = await fetch('/api/cities/pakistan')
    if (!response.ok) {
        throw new Error('Unable to load cities.')
    }

    const data = (await response.json()) as { cities: string[] }
    return data.cities?.length ? data.cities : [...PAKISTAN_CITIES_FALLBACK]
}

export const usePakistanCities = () => {
    return useQuery({
        queryKey: ['pakistan-cities'],
        queryFn: fetchPakistanCitiesFromApi,
        staleTime: 1000 * 60 * 60 * 24,
        placeholderData: [...PAKISTAN_CITIES_FALLBACK],
    })
}
