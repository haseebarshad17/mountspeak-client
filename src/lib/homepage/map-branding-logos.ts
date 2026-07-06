import { resolveBrandingLogoUrl } from '@/lib/supabase/homepage-media'
import type { TrustBrand } from '@/services/homepage/homepage.page.types'

function labelFromLogoPath(path: string): string {
    const fileName = path.split('/').filter(Boolean).pop() ?? path
    const baseName = fileName.replace(/\.[^.]+$/, '').replace(/^logo[-_]?/i, '')

    const label = baseName.replace(/[-_]+/g, ' ').trim()
    if (!label) return 'Partner'

    return label.replace(/\b\w/g, (char) => char.toUpperCase())
}

export function mapBrandingLogosToTrustBrands(logos: string[]): TrustBrand[] {
    return logos
        .map((logo) => logo?.trim())
        .filter((logo): logo is string => Boolean(logo))
        .map((src, index) => {
            const name = labelFromLogoPath(src)

            return {
                id: `branding-logo-${index}`,
                name,
                src: resolveBrandingLogoUrl(src),
                alt: name,
            }
        })
}
