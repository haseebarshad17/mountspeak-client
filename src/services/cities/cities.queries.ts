import { useQuery } from '@tanstack/react-query'

import { PAKISTAN_CITIES_FALLBACK } from '@/constants/pakistan-cities'
import { WORLD_COUNTRIES } from '@/constants/world-countries'

async function fetchPakistanCitiesFromApi(): Promise<string[]> {
    const response = await fetch('/api/cities/pakistan')
    if (!response.ok) {
        throw new Error('Unable to load cities.')
    }

    const data = (await response.json()) as { cities: string[] }
    return data.cities?.length ? data.cities : [...PAKISTAN_CITIES_FALLBACK]
}

async function fetchCountriesFromApi(): Promise<string[]> {
    const response = await fetch('/api/countries')
    if (!response.ok) {
        throw new Error('Unable to load countries.')
    }

    const data = (await response.json()) as { countries: string[] }
    return data.countries?.length ? data.countries : [...WORLD_COUNTRIES]
}

export const usePakistanCities = (enabled = true) => {
    return useQuery({
        queryKey: ['pakistan-cities'],
        queryFn: fetchPakistanCitiesFromApi,
        enabled,
        staleTime: 1000 * 60 * 60 * 24,
        placeholderData: [...PAKISTAN_CITIES_FALLBACK],
    })
}

export const useCountries = (enabled = true) => {
    return useQuery({
        queryKey: ['countries'],
        queryFn: fetchCountriesFromApi,
        enabled,
        staleTime: 1000 * 60 * 60 * 24,
        placeholderData: [...WORLD_COUNTRIES],
    })
}
