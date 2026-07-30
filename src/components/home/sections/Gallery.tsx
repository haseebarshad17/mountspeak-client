'use client'

import { useMemo, useState } from 'react'
import { EmptyState } from '@/components/ui/EmptyState'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import { resolveThemeAssetUrl } from '@/lib/media/resolve-theme-asset'
import type { TourismGallerySection } from '@/services/agency/agency.types'
import { cn } from '@/lib/utils/cn'

const TILES = [
    'aspect-[4/5]',
    'aspect-square',
    'aspect-[3/4]',
    'aspect-[5/4]',
    'aspect-square',
    'aspect-[4/3]',
]

export function Gallery({ data }: { data: TourismGallerySection }) {
    const variant = useTemplateVariant()
    const filters = data.filters?.length ? data.filters : ['All']
    const [active, setActive] = useState(filters[0] ?? 'All')

    const images = useMemo(() => {
        const all = data.images ?? []
        if (active === 'All') return all
        return all.filter((image) => image.category === active)
    }, [active, data.images])

    if (variant !== 'classic') return null

    return (
        <section className="bg-[#FCF8F3] py-16 md:py-20">
            <div className="site-container">
                <div className="max-w-2xl">
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#888]">
                        {data.eyebrow}
                    </p>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111] md:text-4xl">
                        {data.title}
                    </h2>
                    <p className="mt-3 text-[#333]/70">{data.paragraph}</p>
                </div>

                <div className="mt-6 flex flex-wrap gap-2 pb-2">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            type="button"
                            onClick={() => setActive(filter)}
                            className={cn(
                                'shrink-0 rounded-full px-4 py-2 text-sm',
                                active === filter
                                    ? 'bg-[#111] text-white'
                                    : 'bg-white text-[#333]'
                            )}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {images.length === 0 ? (
                    <div className="mt-10">
                        <EmptyState
                            title="Gallery is empty"
                            description="Upload gallery images in the site theme to fill this section."
                        />
                    </div>
                ) : (
                    <div className="mt-10 columns-2 gap-4 md:columns-3">
                        {images.slice(0, 9).map((image, i) => {
                            const src = resolveThemeAssetUrl(image.src)
                            return (
                                <div
                                    key={`${image.src}-${i}`}
                                    className={cn(
                                        'mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-[#EDE7DE] bg-cover bg-center',
                                        TILES[i % TILES.length]
                                    )}
                                    style={
                                        src
                                            ? {
                                                backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.08), rgba(0,0,0,0.22)), url(${src})`,
                                            }
                                            : undefined
                                    }
                                    role="img"
                                    aria-label={image.alt}
                                />
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    )
}
