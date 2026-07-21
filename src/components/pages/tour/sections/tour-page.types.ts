import tourDocument from '../tour-content.json'

import type { ListingKind } from '@/lib/homepage/specialization'

export type TourHeroCta = {
    label: string
    url: string
    style: string
}

type BaseTourPage = (typeof tourDocument)['page']

export type TourOverviewStatistic = {
    label: string
    value: string
}

export type TourPackageInquiry = {
    packageId: string
    title: string
    departureDate?: string | null
}

export type TourPage = Omit<BaseTourPage, 'heroSection' | 'overviewSection'> & {
    heroSection: Omit<BaseTourPage['heroSection'], 'ctaGroup'> & {
        ctaGroup: TourHeroCta[]
    }
    overviewSection: Omit<BaseTourPage['overviewSection'], 'statistics'> & {
        statistics: TourOverviewStatistic[]
    }
    /** Domestic tours use checkout; international tours use booking-request inquiry only. */
    listingKind?: ListingKind
    packageInquiry?: TourPackageInquiry
    /** True when tour start date is today or earlier — book CTAs should be disabled. */
    isBookingClosed?: boolean
    pickupPointsSection?: {
        id: string
        title: string
        intro: string
        points: Array<{
            id: string
            city: string
            pickupTime: string | null
            notes: string | null
            isPrimary: boolean
        }>
    }
}
