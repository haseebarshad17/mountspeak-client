export type AboutValue = {
    title: string
    description: string
}

export type AboutStat = {
    value: string
    label: string
}

export const aboutHero = {
    eyebrow: 'About Us',
    title: 'Guiding explorers through Pakistan',
    description:
        'We connect travelers with trusted local agencies to deliver safe, memorable journeys across Pakistan\'s most remarkable landscapes and cultures.',
}

export const aboutMission = {
    title: 'Our mission',
    paragraphs: [
        'Pakistan Travel was built to make expedition planning simple, transparent, and reliable. From mountain treks in the north to heritage walks in historic cities, we help you discover experiences that match your pace and preferences.',
        'Every tour listed on our platform is published by a verified partner agency. We focus on clear itineraries, honest pricing, and responsive support so you can book with confidence.',
    ],
}

export const aboutValues: AboutValue[] = [
    {
        title: 'Local expertise',
        description:
            'Our partner agencies live and work in the regions they guide, bringing deep knowledge of routes, seasons, and cultural context.',
    },
    {
        title: 'Safety first',
        description:
            'We prioritize vetted operators, clear trip details, and direct communication so you know what to expect before you depart.',
    },
    {
        title: 'Tailored journeys',
        description:
            'Whether you want a fixed group departure or a custom consultation, our team helps you shape the right itinerary.',
    },
    {
        title: 'Transparent booking',
        description:
            'Published pricing, seat availability, and straightforward requests keep the booking process honest from start to finish.',
    },
]

export const aboutStats: AboutStat[] = [
    { value: '50+', label: 'Published tours' },
    { value: '15+', label: 'Regions covered' },
    { value: '24/7', label: 'Consultation support' },
    { value: '100%', label: 'Partner-verified listings' },
]

export const aboutStory = {
    title: 'Who we are',
    paragraphs: [
        'Founded by travelers who experienced both the beauty and complexity of planning trips in Pakistan, our platform bridges the gap between curious explorers and professional tour operators.',
        'We believe the country\'s peaks, valleys, deserts, and cities deserve to be explored responsibly. That means working with agencies that respect local communities, follow safety standards, and deliver the kind of hospitality Pakistan is known for.',
    ],
}
