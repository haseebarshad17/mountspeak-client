import tourDocument from '../tour-content.json'

export type TourHeroCta = {
    label: string
    url: string
    style: string
}

type BaseTourPage = (typeof tourDocument)['page']

export type TourPage = Omit<BaseTourPage, 'heroSection'> & {
    heroSection: Omit<BaseTourPage['heroSection'], 'ctaGroup'> & {
        ctaGroup: TourHeroCta[]
    }
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
