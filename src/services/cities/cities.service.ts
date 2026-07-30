import { PAKISTAN_CITIES_FALLBACK } from '@/constants/pakistan-cities'
import { WORLD_COUNTRIES } from '@/constants/world-countries'

export async function fetchPakistanCities(): Promise<string[]> {
    return [...PAKISTAN_CITIES_FALLBACK]
}

export async function fetchCountries(): Promise<string[]> {
    return [...WORLD_COUNTRIES]
}
