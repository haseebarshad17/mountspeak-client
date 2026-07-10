export interface TourItem {
    id: number
    image: string
    title: string
    agency: string
    price: string
    rating: number
    reviews: number
    location: string
    duration: string
}

export interface AgencyItem {
    name: string
    tours: number
    rating: number
    verified: boolean
}

export interface ClientHeaderNavItem {
    label: string
    href: string
}

export interface ClientFooterLinkItem {
    label: string
    href: string
}

export const heroContent = {
    title: 'Discover Your Next Adventure',
    subtitle: 'Browse thousands of tours from trusted agencies across Pakistan',
    searchPlaceholder: 'Search tours, destinations, or agencies...',
    searchButtonLabel: 'Search',
}

export const clientHeaderContent = {
    brand: 'Tenta',
    navItems: [
        { label: 'Browse Tours', href: '/client/tours' },
        { label: 'Destinations', href: '/client' },
        { label: 'Top Agencies', href: '/client' },
    ] as ClientHeaderNavItem[],
    portalLabel: 'Agency Portal',
    portalHref: '/client/dashboard',
}

export const categories = [
    'All Tours',
    'Adventure',
    'Cultural',
    'Luxury',
    'Desert Safari',
    'City Tours',
    'Mountain Trekking',
    'Beach & Coastal',
]

export const featuredSectionContent = {
    title: 'Featured Tours',
    subtitle: 'Handpicked adventures just for you',
    viewAllLabel: 'View All',
    viewAllHref: '/client/tours',
}

export const featuredTours: TourItem[] = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        title: 'K2 Base Camp Trek',
        agency: 'Pakistan Adventures',
        price: '$2,500',
        rating: 4.9,
        reviews: 124,
        location: 'Gilgit-Baltistan',
        duration: '14 days',
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop',
        title: 'Hunza Valley Explorer',
        agency: 'Hunza Explorers',
        price: '$1,800',
        rating: 4.8,
        reviews: 89,
        location: 'Hunza Valley',
        duration: '7 days',
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop',
        title: 'Dubai Desert Safari',
        agency: 'Desert Adventures',
        price: '$450',
        rating: 4.7,
        reviews: 256,
        location: 'Dubai, UAE',
        duration: '1 day',
    },
    {
        id: 4,
        image: 'https://images.unsplash.com/photo-1558005530-a7958896ec60?w=600&h=400&fit=crop',
        title: 'Lahore Heritage Walk',
        agency: 'Lahore Heritage',
        price: '$350',
        rating: 4.6,
        reviews: 67,
        location: 'Lahore',
        duration: '4 hours',
    },
    {
        id: 5,
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop',
        title: 'Swat Valley Experience',
        agency: 'Swat Tours',
        price: '$1,200',
        rating: 4.9,
        reviews: 143,
        location: 'Swat Valley',
        duration: '5 days',
    },
    {
        id: 6,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        title: 'Naran Kaghan Journey',
        agency: 'Northern Tours',
        price: '$950',
        rating: 4.7,
        reviews: 92,
        location: 'Naran',
        duration: '3 days',
    },
]

export const promoBannerContent = {
    title: 'Summer Special: Up to 30% Off',
    subtitle: 'Book your adventure now and save big on selected tours',
    buttonLabel: 'Browse Deals',
}

export const topAgenciesSectionContent = {
    title: 'Top Rated Agencies',
    subtitle: 'Trusted tour operators with verified reviews',
}

export const topAgencies: AgencyItem[] = [
    { name: 'Pakistan Adventures', tours: 156, rating: 4.9, verified: true },
    { name: 'Hunza Explorers', tours: 128, rating: 4.8, verified: true },
    { name: 'Desert Adventures', tours: 98, rating: 4.7, verified: true },
    { name: 'Lahore Heritage', tours: 87, rating: 4.6, verified: false },
]

export const ctaContent = {
    title: 'Ready to Start Your Journey?',
    subtitle: 'Browse all available tours and find your perfect adventure',
    buttonLabel: 'View All Tours',
    buttonHref: '/client/tours',
}

export const clientFooterContent = {
    brand: 'Tenta',
    description: 'Empowering tour agencies to build and scale their platforms with ease.',
    columns: [
        {
            title: 'Product',
            links: [
                { label: 'Features', href: '#' },
                { label: 'Pricing', href: '#' },
                { label: 'Showcase', href: '#' },
                { label: 'Integrations', href: '#' },
            ] as ClientFooterLinkItem[],
        },
        {
            title: 'Company',
            links: [
                { label: 'About Us', href: '#' },
                { label: 'Careers', href: '#' },
                { label: 'Blog', href: '#' },
                { label: 'Contact', href: '#' },
            ] as ClientFooterLinkItem[],
        },
    ],
    contact: {
        email: 'hello@tenta.com',
        phone: '+92 300 1234567',
        address: 'Islamabad, Pakistan',
    },
    legalLinks: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Cookie Policy', href: '/privacy' },
    ] as ClientFooterLinkItem[],
    copyright: '© 2026 Tenta. All rights reserved.',
}
