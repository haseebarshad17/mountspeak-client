export type TermsSection = {
    id: string
    index: string
    label: string
    badge: string
    heading: string
    paragraphs?: string[]
    items?: { icon: string; title: string; body: string }[]
    list?: { title: string; body: string }[]
    cookieTable?: { type: string; purpose: string; duration: string }[]
}

export const termsSections: TermsSection[] = [
    {
        id: 'introduction',
        index: '01',
        label: 'Introduction',
        badge: 'Legal Notice',
        heading: 'Introduction',
        paragraphs: [
            'Welcome to Pakistan Travel. These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity, and Pakistan Travel, concerning your access to and use of our platform and travel services.',
            'By accessing the Site, you represent that you have read, understood, and agreed to be bound by all of these Terms and Conditions. If you do not agree with all of these terms, then you are expressly prohibited from using the Site and you must discontinue use immediately.',
        ],
    },
    {
        id: 'user-responsibilities',
        index: '02',
        label: 'User Responsibilities',
        badge: 'Section 02',
        heading: 'User Responsibilities',
        items: [
            {
                icon: 'shield',
                title: 'Account Integrity',
                body: 'Users are responsible for maintaining the confidentiality of their account credentials. You agree to accept responsibility for all activities that occur under your account or password.',
            },
            {
                icon: 'globe',
                title: 'Travel Documentation',
                body: 'It is the sole responsibility of the traveler to obtain and carry all necessary visas, permits, and health certifications required for travel within Pakistan. We are not liable for any disruption caused by missing documentation.',
            },
            {
                icon: 'file',
                title: 'Local Compliance',
                body: 'Travelers must respect the local laws, customs, and environmental regulations of the regions visited. Failure to comply may result in immediate termination of travel services without refund.',
            },
        ],
    },
    {
        id: 'payment-terms',
        index: '03',
        label: 'Payment Terms',
        badge: 'Section 03',
        heading: 'Payment Terms',
        paragraphs: [
            'All payments are processed via secure encryption. We accept major credit cards, bank transfers, and local digital payment methods prevalent in Pakistan.',
        ],
        list: [
            {
                title: 'Booking Deposit',
                body: 'A 25% non-refundable deposit is required at the time of booking to secure your itinerary and local guides.',
            },
            {
                title: 'Final Payment',
                body: 'The remaining balance must be settled at least 30 days prior to the departure date. Failure to pay may result in cancellation.',
            }
        ],
    },
    {
        id: 'data-protection',
        index: '04',
        label: 'Data Protection',
        badge: 'Privacy Policy',
        heading: 'Data Protection',
        paragraphs: [
            'We are committed to protecting your personal data. We collect information only necessary to provide travel services, including your name, contact details, passport information, and travel preferences.',
            'We do not sell your personal data to third-party marketers.',
            'Data is shared only with essential service providers (airlines, hotels, local guides).',
            'You have the right to request access to or deletion of your personal data at any time.',
            'All data is stored on secure, encrypted servers following industry-standard protocols.',
        ],
    },
    {
        id: 'cookie-policy',
        index: '05',
        label: 'Cookie Policy',
        badge: 'Section 05',
        heading: 'Cookie Policy',
        cookieTable: [
            {
                type: 'Essential',
                purpose: 'Used for account authentication and security.',
                duration: 'Session',
            },
            {
                type: 'Performance',
                purpose: 'Helps us understand how visitors interact with the site.',
                duration: '30 Days',
            },
            {
                type: 'Preferences',
                purpose: 'Remembers your language and currency settings.',
                duration: '1 Year',
            },
        ],
    },
    {
        id: 'liability-law',
        index: '06',
        label: 'Liability & Law',
        badge: 'Section 06',
        heading: 'Liability & Law',
        paragraphs: [
            'Pakistan Travel shall not be held responsible for events beyond our reasonable control (Force Majeure), including but not limited to natural disasters, political instability, or government-imposed travel restrictions.',
            'These terms are governed by and construed in accordance with the laws of the Islamic Republic of Pakistan. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Islamabad.',
        ],
    },
]
