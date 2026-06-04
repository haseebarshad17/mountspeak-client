import type { HomepagePage } from '@/data/homepage'
import { filterHomepageDestinationCards } from '@/data/homepage'

export type PopularDestinationFilter = string

export type DestinationCard = {
    id: string
    name: string
    image: string
    region: string
}

export function getPopularDestinationFilters(page: HomepagePage) {
    return page.sections.popularDestination.filters
}

export function getDestinationCards(page: HomepagePage) {
    return page.sections.popularDestination.cards as DestinationCard[]
}

export function filterDestinationCards(page: HomepagePage, activeFilter: string) {
    return filterHomepageDestinationCards(page, activeFilter) as DestinationCard[]
}
