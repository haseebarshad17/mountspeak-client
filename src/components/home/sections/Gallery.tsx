'use client'

import { useMemo, useState } from 'react'
import { EmptyState } from '@/components/ui/EmptyState'
import { Temp3SectionHeader } from '@/components/home/Temp3SectionHeader'
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

    if (variant === 'temp1') {
        return (
            <section className="section-spacing bg-white">
                <div className="site-container">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-brand text-sm font-medium uppercase">
                            {data.eyebrow}
                        </p>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111] md:text-4xl">
                            {data.title}
                        </h2>
                        {data.paragraph ? (
                            <p className="mt-3 text-[#333]/70">{data.paragraph}</p>
                        ) : null}
                    </div>

                    <div className="mt-8 flex flex-wrap justify-center gap-2 pb-2">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                type="button"
                                onClick={() => setActive(filter)}
                                className={cn(
                                    'shrink-0 rounded-full px-4 py-2 text-sm transition',
                                    active === filter
                                        ? 'bg-brand'
                                        : 'border border-black/10 bg-white text-[#333] hover:bg-black/5'
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
                        <div className="mt-10 columns-2 gap-4 sm:columns-3 lg:columns-4">
                            {images.slice(0, 12).map((image, i) => {
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
                                                ? { backgroundImage: `url(${src})` }
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

    if (variant === 'temp3') {
        return (
            <section className="t3-section t3-section-soft">
                <div className="t3-wrap">
                    <Temp3SectionHeader
                        eyebrow={data.eyebrow}
                        title={data.title}
                        subtitle={data.paragraph}
                        tone="cream"
                    />

                    {filters.length > 1 ? (
                        <div className="mb-8 flex flex-wrap justify-center gap-2">
                            {filters.map((filter) => (
                                <button
                                    key={filter}
                                    type="button"
                                    onClick={() => setActive(filter)}
                                    className={cn(
                                        't3-chip',
                                        active === filter
                                            ? 't3-chip-on-cream-active'
                                            : 't3-chip-on-cream hover:border-t3-navy/25'
                                    )}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    ) : null}

                    {images.length === 0 ? (
                        <EmptyState
                            title="Gallery is empty"
                            description="Upload gallery images in the site theme to fill this section."
                        />
                    ) : (
                        <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-4 lg:gap-5">
                            {images.slice(0, 8).map((image, i) => {
                                const src = resolveThemeAssetUrl(image.src)
                                const caption = image.alt || image.category

                                return (
                                    <article
                                        key={`${image.src}-${i}`}
                                        className="group relative aspect-[3/4] overflow-hidden rounded-[14px] bg-t3-navy shadow-[0_12px_32px_rgba(14,27,51,0.08)]"
                                    >
                                        {src ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={src}
                                                alt={image.alt || 'Gallery image'}
                                                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-t3-navy to-t3-panel" />
                                        )}

                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0E1B33]/80 via-[#0E1B33]/25 to-transparent" />

                                        {caption ? (
                                            <p className="absolute inset-x-0 bottom-0 p-4 font-ui text-[13px] leading-snug text-white sm:p-5 sm:text-sm">
                                                {caption}
                                            </p>
                                        ) : null}
                                    </article>
                                )
                            })}
                        </div>
                    )}
                </div>
            </section>
        )
    }

    if (variant === 'temp2') {
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

    return null
}
