export type TermsSection = {
    id: string
    index: string
    label: string
    badge: string
    heading: string
    paragraphs?: string[]
    items?: { icon: string; title: string; body: string }[]
    list?: { title: string; body: string }[]
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
                title: 'Accurate Information',
                body: 'You agree to provide accurate, current and complete information during the booking process. Pakistan Travel reserves the right to cancel bookings found to contain false or misleading information.',
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
            'All prices displayed on the Site are in Pakistani Rupees (PKR) unless otherwise stated. Pakistan Travel reserves the right to modify pricing at any time without prior notice.',
        ],
        list: [
            {
                title: 'Booking Deposit',
                body: 'A non-refundable deposit of 30% is required at the time of booking confirmation.',
            },
            {
                title: 'Full Payment',
                body: 'Full payment must be received no later than 14 days before the scheduled departure date.',
            },
            {
                title: 'Cancellation Fees',
                body: 'Cancellations made within 7 days of departure are subject to a 100% cancellation fee.',
            },
            {
                title: 'Accepted Methods',
                body: 'We accept payments via bank transfer, JazzCash, EasyPaisa, and major credit/debit cards.',
            },
        ],
    },
    {
        id: 'data-protection',
        index: '04',
        label: 'Data Protection',
        badge: 'Section 04',
        heading: 'Data Protection',
        paragraphs: [
            'Pakistan Travel is committed to protecting your personal information. We collect, use, and share your data only as described in this Privacy Policy and in accordance with applicable data protection laws.',
            'We collect personal information such as your name, email address, phone number, and payment details solely for the purpose of providing travel services. Your data will not be sold to third parties.',
        ],
        items: [
            {
                icon: 'lock',
                title: 'Data Security',
                body: 'We implement industry-standard encryption and security measures to protect your personal information from unauthorized access, alteration, or disclosure.',
            },
            {
                icon: 'eye',
                title: 'Your Rights',
                body: 'You have the right to access, correct, or delete your personal data at any time by contacting our support team at privacy@pakistantravel.pk.',
            },
        ],
    },
    {
        id: 'cookie-policy',
        index: '05',
        label: 'Cookie Policy',
        badge: 'Section 05',
        heading: 'Cookie Policy',
        paragraphs: [
            'Our website uses cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and personalize content. By continuing to use our website, you consent to our use of cookies.',
            'You may control cookie settings through your browser. However, disabling certain cookies may impact the functionality of our website and services.',
        ],
    },
    {
        id: 'liability-law',
        index: '06',
        label: 'Liability & Law',
        badge: 'Section 06',
        heading: 'Liability & Law',
        paragraphs: [
            'Pakistan Travel acts as an intermediary between travelers and local service providers. We are not liable for any loss, injury, damage, or expenses arising from events beyond our control, including but not limited to natural disasters, political unrest, or acts of terrorism.',
            'These Terms and Conditions are governed by and construed in accordance with the laws of the Islamic Republic of Pakistan. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Islamabad, Pakistan.',
        ],
    },
]
