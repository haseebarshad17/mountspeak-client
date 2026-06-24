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
}
