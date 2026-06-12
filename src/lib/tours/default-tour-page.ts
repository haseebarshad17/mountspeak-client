import type { TourPage } from '@/components/pages/tour/sections/tour-page.types'
import tourDocument from '@/components/pages/tour/tour-content.json'
import type { TourListItem } from '@/services/tours/tours.types'

export const DEMO_TOUR_DETAIL_PATH = '/details'

export const DEMO_TOUR_PAGE = structuredClone(tourDocument.page) as TourPage

export const DEMO_TOUR_LIST_ITEM: TourListItem = {
    id: DEMO_TOUR_PAGE.id,
    slug: DEMO_TOUR_PAGE.slug,
    title: DEMO_TOUR_PAGE.heroSection.title,
    discountLabel: '10% Off',
    discountPercent: 10,
    image: DEMO_TOUR_PAGE.heroSection.backgroundMedia.desktop,
}
