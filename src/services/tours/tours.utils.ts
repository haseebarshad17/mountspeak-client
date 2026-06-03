import { resolveTourMediaUrl } from '@/lib/supabase/tour-media'

import type { TourListItem, TourRow } from './tours.types'

export function formatTourDiscount(percent: number | null | undefined): string {
    if (percent == null || Number.isNaN(Number(percent))) {
        return ''
    }

    return `${Number(percent).toFixed(2)}% Off`
}

export function getTourCoverImage(tour: Pick<TourRow, 'header' | 'overview' | 'visual_fragments'>): string {
    const hero = resolveTourMediaUrl(tour.header?.hero_image_url)
    if (hero) return hero

    const overview = resolveTourMediaUrl(tour.overview?.image_url)
    if (overview) return overview

    const fragment = tour.visual_fragments?.[0]
    const gallery = resolveTourMediaUrl(fragment)
    if (gallery) return gallery

    return 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'
}

export function toTourListItem(tour: TourRow): TourListItem {
    return {
        id: tour.id,
        slug: tour.slug,
        title: tour.title,
        discountLabel: formatTourDiscount(tour.discount_percent),
        image: getTourCoverImage(tour),
    }
}

export function tourDetailPath(slug: string): string {
    return `/tours/${slug}`
}
