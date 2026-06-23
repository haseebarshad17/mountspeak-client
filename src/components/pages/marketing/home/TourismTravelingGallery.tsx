'use client'

import { HP_THEME_BTN_CLASS, HP_THEME_BTN_STYLE, STATIC_UI_COLORS } from '@/data/homepage'
import { FilterPills } from '@/components/pages/marketing/home/filter-pills'
import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import { Button } from '@/components/ui/button'
import { GalleryImageZoomModal } from '@/components/ui/gallery-image-zoom-modal'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import { cn } from '@/lib/utils/clsxUtils'
import { StorageMediaImage } from '@/components/ui/storage-media-image'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

const IMAGES_PER_ROW = 6
const INITIAL_VISIBLE_ROWS = 1

type GalleryImage = {
    src: string
    alt: string
}

function preloadGalleryImages(images: GalleryImage[]) {
    images.forEach((image) => {
        const img = new window.Image()
        img.src = image.src
    })
}

function GalleryImageCard({
    src,
    alt,
    onOpen,
    eager = false,
}: GalleryImage & {
    onOpen: () => void
    eager?: boolean
}) {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(false)
    }, [src])

    return (
        <button
            type='button'
            onClick={onOpen}
            className='group relative aspect-[229.33/305.77] w-full overflow-hidden rounded-[10px] cursor-zoom-in bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hp-color-primary)] focus-visible:ring-offset-2'
            aria-label={`View larger image: ${alt}`}
        >
            {!isLoaded ? (
                <span
                    className='absolute inset-0 animate-pulse bg-neutral-200'
                    aria-hidden
                />
            ) : null}
            <StorageMediaImage
                src={src}
                alt={alt}
                fill
                unoptimized
                loading={eager ? 'eager' : 'lazy'}
                priority={eager}
                onLoad={() => setIsLoaded(true)}
                className={cn(
                    'object-cover transition-[opacity,transform] duration-300 group-hover:scale-105',
                    isLoaded ? 'opacity-100' : 'opacity-0',
                )}
                sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 229px'
            />
        </button>
    )
}

const TourismTravelingGallery = ({ page }: HomepagePageProps) => {
    const section = page.sections.tourismGallery
    const [activeFilter, setActiveFilter] = useState('All')
    const [visibleRows, setVisibleRows] = useState(INITIAL_VISIBLE_ROWS)
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

    const closeImageModal = useCallback(() => {
        setSelectedImageIndex(null)
    }, [])

    const filteredImages = useMemo(() => {
        if (activeFilter === 'All') return section.images
        return section.images.filter((image) => image.category === activeFilter)
    }, [activeFilter, section.images])

    const totalRows = Math.ceil(filteredImages.length / IMAGES_PER_ROW)
    const showToggleButton = filteredImages.length > IMAGES_PER_ROW
    const isFullyExpanded = visibleRows >= totalRows
    const visibleImages = filteredImages.slice(0, visibleRows * IMAGES_PER_ROW)
    const firstLazyRowIndex = Math.max(0, visibleRows - 1) * IMAGES_PER_ROW

    const preloadRowImages = useCallback(
        (rowIndex: number) => {
            const start = rowIndex * IMAGES_PER_ROW
            preloadGalleryImages(filteredImages.slice(start, start + IMAGES_PER_ROW))
        },
        [filteredImages],
    )

    useEffect(() => {
        setVisibleRows(INITIAL_VISIBLE_ROWS)
        setSelectedImageIndex(null)
    }, [activeFilter])

    useEffect(() => {
        if (visibleRows < totalRows) {
            preloadRowImages(visibleRows)
        }
    }, [preloadRowImages, totalRows, visibleRows])

    useEffect(() => {
        if (selectedImageIndex !== null && selectedImageIndex >= visibleImages.length) {
            setSelectedImageIndex(null)
        }
    }, [selectedImageIndex, visibleImages.length])

    const handleToggleRows = () => {
        if (isFullyExpanded) {
            setVisibleRows(INITIAL_VISIBLE_ROWS)
            return
        }

        preloadRowImages(visibleRows)
        setVisibleRows((current) => Math.min(current + 1, totalRows))
    }

    const handlePreloadNextRow = () => {
        if (!isFullyExpanded) {
            preloadRowImages(visibleRows)
        }
    }

    return (
        <section className='bg-white' aria-labelledby='tourism-gallery-heading'>
            <div className='agency-container'>
                <header className='mx-auto max-w-[900px] px-1 text-center sm:px-0'>
                    <SectionEyebrow name={section.eyebrow} />
                    <h2
                        id='tourism-gallery-heading'
                        className='agency-section-heading pt-2 text-[28px] font-medium leading-tight sm:pt-3 sm:text-[34px] sm:leading-[40px] lg:pt-4 lg:text-[40px] lg:leading-[48px]'
                        style={{ color: STATIC_UI_COLORS.title, fontFamily: 'var(--hp-font-heading)' }}
                    >
                        {section.title}
                    </h2>
                    <p
                        className='mx-auto max-w-[861px] pt-3 text-sm font-normal leading-6 sm:pt-4 sm:text-base sm:leading-7 md:pt-5 md:text-lg md:leading-8'
                        style={{ color: STATIC_UI_COLORS.textMuted, fontFamily: 'var(--hp-font-body)' }}
                    >
                        {section.paragraph}
                    </p>
                </header>
                <FilterPills
                    labels={section.filters}
                    activeLabel={activeFilter}
                    onLabelChange={setActiveFilter}
                    className='mx-auto max-w-[1290px] pt-6 sm:pt-8 lg:pt-10'
                />

                <div className='mx-auto mt-6 grid max-w-[1424px] grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-[12px] lg:mt-2 lg:grid-cols-6'>
                    {visibleImages.map((image, index) => (
                        <GalleryImageCard
                            key={`${image.src}-${index}`}
                            src={image.src}
                            alt={image.alt}
                            eager={index < IMAGES_PER_ROW || index >= firstLazyRowIndex}
                            onOpen={() => setSelectedImageIndex(index)}
                        />
                    ))}
                </div>

                {showToggleButton ? (
                    <div className='mt-8 flex justify-center sm:mt-10'>
                        <Button
                            type='button'
                            variant='default'
                            style={HP_THEME_BTN_STYLE}
                            className={cn('w-max min-w-[140px]', HP_THEME_BTN_CLASS)}
                            onMouseEnter={handlePreloadNextRow}
                            onFocus={handlePreloadNextRow}
                            onClick={handleToggleRows}
                        >
                            {isFullyExpanded ? 'See Less' : 'See More'}
                        </Button>
                    </div>
                ) : null}

                {selectedImageIndex !== null ? (
                    <GalleryImageZoomModal
                        images={visibleImages}
                        activeIndex={selectedImageIndex}
                        onClose={closeImageModal}
                        onNavigate={setSelectedImageIndex}
                    />
                ) : null}
            </div>
        </section>
    )
}

export default TourismTravelingGallery
