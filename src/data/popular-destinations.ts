export const popularDestinationFilters = [
    'All',
    'Skardu',
    'Hunza',
    'Khaplu',
    'Kashmir',
    'Swat Kalam',
    'Naran Kaghan',
    'Murree',
    'Nathia Gali',
    'Patriata',
    'Babusar Top',
    'Umbrella Waterfall',
    'Khanpur Dam',
] as const

export type PopularDestinationFilter = (typeof popularDestinationFilters)[number]

export type DestinationCard = {
    id: string
    name: string
    image: string
    region: Exclude<PopularDestinationFilter, 'All'>
}

export const destinationCards: DestinationCard[] = [
    {
        id: 'skardu-1',
        name: 'Skardu',
        region: 'Skardu',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    },
    {
        id: 'skardu-2',
        name: 'Shangrila Resort',
        region: 'Skardu',
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
    },
    {
        id: 'hunza-1',
        name: 'Hunza',
        region: 'Hunza',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    },
    {
        id: 'hunza-2',
        name: 'Attabad Lake',
        region: 'Hunza',
        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    },
    {
        id: 'khaplu-1',
        name: 'Khaplu Fort',
        region: 'Khaplu',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
    },
    {
        id: 'kashmir-1',
        name: 'Kashmir',
        region: 'Kashmir',
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    },
    {
        id: 'kashmir-2',
        name: 'Neelum Valley',
        region: 'Kashmir',
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    },
    {
        id: 'swat-1',
        name: 'Swat Kalam',
        region: 'Swat Kalam',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    },
    {
        id: 'naran-1',
        name: 'Naran Kaghan',
        region: 'Naran Kaghan',
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    },
    {
        id: 'naran-2',
        name: 'Saif-ul-Malook',
        region: 'Naran Kaghan',
        image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
    },
    {
        id: 'murree-1',
        name: 'Murree',
        region: 'Murree',
        image: 'https://images.unsplash.com/photo-1448375244086-882707edb798?auto=format&fit=crop&w=1200&q=80',
    },
    {
        id: 'nathia-1',
        name: 'Nathia Gali',
        region: 'Nathia Gali',
        image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    },
    {
        id: 'patriata-1',
        name: 'Patriata',
        region: 'Patriata',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    },
    {
        id: 'babusar-1',
        name: 'Babusar Top',
        region: 'Babusar Top',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    },
    {
        id: 'umbrella-1',
        name: 'Umbrella Waterfall',
        region: 'Umbrella Waterfall',
        image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8fc?auto=format&fit=crop&w=1200&q=80',
    },
    {
        id: 'khanpur-1',
        name: 'Khanpur Dam',
        region: 'Khanpur Dam',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    },
]

export function filterDestinationCards(activeFilter: string) {
    if (activeFilter === 'All') return destinationCards
    return destinationCards.filter((card) => card.region === activeFilter)
}
