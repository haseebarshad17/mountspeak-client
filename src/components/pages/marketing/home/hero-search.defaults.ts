import type { HomepagePage } from '@/data/homepage'

import type { HeroSearch } from '@/services/homepage/homepage.page.types'

/** Default search filter labels when homepage API data is not loaded yet. */
export const DEFAULT_HERO_SEARCH_FILTERS: HomepagePage['sections']['hero']['searchFilters'] = {
    fromPlaceholder: 'From',
    toPlaceholder: 'To',
    datePlaceholder: 'Date of stay',
    searchButtonLabel: 'Find trip now',
    loadingCities: 'Loading cities...',
    searchCitiesPlaceholder: 'Search location...',
    noMatchingCities: 'No matching cities',
    noCities: 'No cities available',
    pickDepartureFirst: 'Pick a departure first',
    clearDate: 'Clear',
    doneDate: 'Done',
}

export const DEFAULT_HERO_SEARCH_BUTTON: HeroSearch = {
    background: '#276968',
    backgroundHover: '#1f5453',
    text: '#FFFFFF',
}
