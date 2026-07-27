/**
 * Hero background slides — single source of truth is `backgroundImages`.
 * `backgroundImage` stays synced as the first slide for inner-page banners.
 */

export const DEFAULT_HERO_BANNER_IMAGE = '/images/pages/home/tour-list.png'

/** Used only when the agency has no real CMS hero slides. */
export const FALLBACK_HERO_SLIDER_IMAGES = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80',
] as const

export type HeroBackgroundFields = {
    backgroundImage?: string | null
    backgroundImages?: readonly string[] | null
}

function trimPath(value: unknown): string {
    return typeof value === 'string' ? value.trim() : ''
}

function isStockDefaultPath(src: string): boolean {
    return src === DEFAULT_HERO_BANNER_IMAGE
}

/**
 * Collect CMS slide paths. Ignores inherited stock default when real uploads exist.
 * Pass `backgroundImages: undefined` (key omitted) to fall back to legacy `backgroundImage` only.
 */
export function collectHeroBackgroundImages(hero: HeroBackgroundFields): string[] {
    const hasExplicitArray = Array.isArray(hero.backgroundImages)
    const fromArray = hasExplicitArray
        ? (hero.backgroundImages as readonly string[]).map(trimPath).filter(Boolean)
        : []
    const legacy = trimPath(hero.backgroundImage)

    if (hasExplicitArray) {
        const custom = fromArray.filter((src) => !isStockDefaultPath(src))
        if (custom.length > 0) return custom
        if (legacy && !isStockDefaultPath(legacy)) return [legacy]
        return []
    }

    if (legacy && !isStockDefaultPath(legacy)) return [legacy]
    if (legacy) return []
    return []
}

/** Sync array + legacy single field for persistence / inner pages. */
export function syncHeroBackgroundFields<T extends HeroBackgroundFields>(hero: T): T & {
    backgroundImage: string
    backgroundImages: string[]
} {
    const collected = collectHeroBackgroundImages(hero)
    if (collected.length > 0) {
        return {
            ...hero,
            backgroundImages: collected,
            backgroundImage: collected[0],
        }
    }

    const legacy = trimPath(hero.backgroundImage)
    if (legacy && !isStockDefaultPath(legacy)) {
        return {
            ...hero,
            backgroundImages: [legacy],
            backgroundImage: legacy,
        }
    }

    return {
        ...hero,
        backgroundImages: [],
        backgroundImage: '',
    }
}

/**
 * Homepage hero slides.
 * - Real CMS uploads → exactly those images (no Unsplash substitution)
 * - Nothing / stock default only → 2 Unsplash placeholders
 */
export function resolveHeroSliderImages(
    hero: HeroBackgroundFields,
    options?: { forceSingle?: string | null },
): string[] {
    if (options?.forceSingle?.trim()) {
        return [options.forceSingle.trim()]
    }

    const images = collectHeroBackgroundImages(hero)
    if (images.length > 0) return images

    return [...FALLBACK_HERO_SLIDER_IMAGES]
}
