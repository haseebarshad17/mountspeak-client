import { filterHomepageDestinationCards, homepage } from '@/data/homepage'

export const popularDestinationFilters = homepage.sections.popularDestination.filters

export type PopularDestinationFilter = (typeof popularDestinationFilters)[number]

export type DestinationCard = {
    id: string
    name: string
    image: string
    region: Exclude<PopularDestinationFilter, 'All'>
}

export const destinationCards = homepage.sections.popularDestination.cards as DestinationCard[]

export function filterDestinationCards(activeFilter: string) {
    return filterHomepageDestinationCards(activeFilter) as DestinationCard[]
}
