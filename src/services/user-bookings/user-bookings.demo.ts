import { EMPTY_BOOKING_ITINERARY_CONTENT } from '@/lib/bookings/booking-itinerary-content'
import type { UserBookingDisplay, UserPastBookingDisplay } from './user-bookings.types'

export const DEMO_UPCOMING_BOOKINGS: UserBookingDisplay[] = [
    {
        id: 'demo-apt-884-k2',
        referenceId: 'APT-884-K2',
        status: 'Confirmed',
        statusTone: 'confirmed',
        listingKind: 'tour',
        listingKindLabel: 'Domestic Tour',
        title: 'K2 Base Camp & Concordia Trek',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
        schedule: 'Aug 12 — Aug 26, 2024',
        location: 'Baltistan',
        region: 'Karakoram Range',
        dateLabel: 'July 12, 2024',
        members: '4 Members',
        memberCount: 4,
        warning: '',
        slug: 'hunza-valley-fairy-meadows',
        packageId: null,
        primaryAction: 'Download Itinerary',
        secondaryAction: '',
        isPast: false,
        itineraryContent: {
            ...EMPTY_BOOKING_ITINERARY_CONTENT,
            routes: {
                sectionTitle: 'Route',
                items: [
                    {
                        title: 'Islamabad to Skardu',
                        description: 'Scenic drive through the Karakoram Highway with scheduled rest stops.',
                    },
                    {
                        title: 'Skardu to Concordia',
                        description: 'Trek through Baltoro Glacier with guided camp nights.',
                    },
                ],
            },
            stayAndDine: {
                sectionTitle: 'Stay & Dine',
                items: [
                    {
                        title: 'Concordia Base Camp',
                        subtitle: 'Camping',
                        description: 'Shared expedition tents with meals prepared by the trek crew.',
                    },
                ],
            },
            services: {
                sectionTitle: 'Services',
                items: [
                    'Licensed mountain guide',
                    'Porter support',
                    'Camp meals and kitchen crew',
                ],
            },
        },
    },
    {
        id: 'demo-apt-4421-hz',
        referenceId: 'APT-4421-HZ',
        status: 'Action Required',
        statusTone: 'action',
        listingKind: 'tour',
        listingKindLabel: 'Domestic Tour',
        title: 'Autumn in Hunza: The Golden Valley',
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
        schedule: 'Oct 05 — Oct 12, 2024',
        location: 'Gilgit-Baltistan',
        region: 'Gilgit Baltistan',
        dateLabel: 'Aug 05, 2024',
        members: '2 Members',
        memberCount: 2,
        warning: 'Please upload a copy of your passport to confirm booking.',
        slug: 'hunza-valley-fairy-meadows',
        packageId: null,
        primaryAction: 'Download Itinerary',
        secondaryAction: '',
        isPast: false,
        itineraryContent: EMPTY_BOOKING_ITINERARY_CONTENT,
    },
]

export const DEMO_PAST_BOOKINGS: UserPastBookingDisplay[] = [
    {
        status: 'Completed',
        statusTone: 'completed',
        date: 'May 2023',
        title: 'Fairy Meadows Base Camp',
        listingKindLabel: 'Domestic Tour',
        note: 'A clear view of Nanga Parbat, the Killer Mountain.',
        action: 'Rebook Tour',
    },
    {
        status: 'Cancelled',
        statusTone: 'cancelled',
        date: 'Jan 2023',
        title: 'Skardu Winter Expedition',
        listingKindLabel: 'Domestic Tour',
        note: 'Cancelled due to heavy snowfall and pass closure.',
        action: 'Refund Processed',
    },
]
