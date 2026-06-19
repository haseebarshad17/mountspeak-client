export const DEFAULT_UMRAH_HERO_SEARCH = {
    durationLabel: 'Duration of Umrah Package *',
    durationPlaceholder: 'Select duration of package',
    passengersLabel: 'How Many Passengers? *',
    passengersPlaceholder: 'Select number of passengers',
    packageTypeLabel: 'Package Type *',
    packageTypePlaceholder: 'Select package type',
    searchButtonLabel: 'Search',
    searchingButtonLabel: 'Searching...',
} as const

export const UMRAH_PACKAGE_DURATIONS = [
    '7 Days',
    '10 Days',
    '14 Days',
    '21 Days',
    '30 Days',
] as const

export const UMRAH_PASSENGER_OPTIONS = ['1', '2', '3', '4', '5', '6+'] as const

export const UMRAH_PACKAGE_TYPES = ['Economy', 'Standard', 'Premium', 'VIP'] as const
