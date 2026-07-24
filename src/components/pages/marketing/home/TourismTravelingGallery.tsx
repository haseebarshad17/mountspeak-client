'use client'

import { HP_THEME_BTN_CLASS, HP_THEME_BTN_STYLE, STATIC_UI_COLORS } from '@/data/homepage'
import { FilterPills } from '@/components/pages/marketing/home/filter-pills'
import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import { Button } from '@/components/ui/button'
import { GalleryImageZoomModal } from '@/components/ui/gallery-image-zoom-modal'
import { useTemplateStyles } from '@/components/providers/TemplateStylesProvider'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import { cn } from '@/lib/utils/clsxUtils'
import { HomepageMediaImage } from '@/components/ui/homepage-media-image'
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
    className,
    imageSizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 229px',
    tileClassName,
}: GalleryImage & {
    onOpen: () => void
    eager?: boolean
    className?: string
    imageSizes?: string
    tileClassName: string
}) {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(false)
    }, [src])

    return (
        <button
            type='button'
            onClick={onOpen}
            className={cn(tileClassName, className)}
            aria-label={`View larger image: ${alt}`}
        >
            {!isLoaded ? (
                <span
                    className='absolute inset-0 animate-pulse bg-neutral-200'
                    aria-hidden
                />
            ) : null}
            <HomepageMediaImage
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
                sizes={imageSizes}
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

    const mobilePreviewImage = filteredImages[0] ?? null
    const gallery = useTemplateStyles().pages.home.gallery
    const sectionHeader = useTemplateStyles().pages.home.sectionHeader

    useEffect(() => {
        if (selectedImageIndex !== null && selectedImageIndex >= filteredImages.length) {
            setSelectedImageIndex(null)
        }
    }, [selectedImageIndex, filteredImages.length])

    const openCategorySlider = useCallback(
        (index: number) => {
            if (filteredImages.length === 0) return
            setSelectedImageIndex(index)
        },
        [filteredImages.length],
    )

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
                <header className={cn(gallery.header)}>
                    <SectionEyebrow name={section.eyebrow} className={sectionHeader.eyebrow} />
                    <h2
                        id='tourism-gallery-heading'
                        className={cn(
                            sectionHeader.title,
                            'pt-2 text-[28px] font-medium leading-tight sm:pt-3 sm:text-[34px] sm:leading-[40px] lg:pt-4 lg:text-[40px] lg:leading-[48px]',
                        )}
                        style={{ color: STATIC_UI_COLORS.title, fontFamily: 'var(--hp-font-heading)' }}
                    >
                        {section.title}
                    </h2>
                    <p
                        className={cn(
                            'pt-3 text-sm font-normal leading-6 sm:pt-4 sm:text-base sm:leading-6 md:pt-5 md:text-lg md:leading-6',
                            'mx-auto max-w-[861px] md:mx-0',
                        )}
                        style={{ color: STATIC_UI_COLORS.textMuted, fontFamily: 'var(--hp-font-body)' }}
                    >
                        {section.paragraph}
                    </p>
                </header>
                <FilterPills
                    labels={section.filters}
                    activeLabel={activeFilter}
                    onLabelChange={setActiveFilter}
                    className='mx-auto max-w-[1290px] pt-6 sm:pt-8 lg:pt-10 md:mx-0'
                />

                {mobilePreviewImage ? (
                    <div className='mx-auto mt-6 max-w-[420px] sm:hidden'>
                        <GalleryImageCard
                            key={`${mobilePreviewImage.src}-mobile`}
                            src={mobilePreviewImage.src}
                            alt={mobilePreviewImage.alt}
                            eager
                            imageSizes='100vw'
                            tileClassName={gallery.tile}
                            className='aspect-[4/5] max-h-[420px]'
                            onOpen={() => openCategorySlider(0)}
                        />
                    </div>
                ) : null}

                <div className={cn(gallery.grid)}>
                    {visibleImages.map((image, index) => (
                        <GalleryImageCard
                            key={`${image.src}-${index}`}
                            src={image.src}
                            alt={image.alt}
                            tileClassName={gallery.tile}
                            eager={index < IMAGES_PER_ROW || index >= firstLazyRowIndex}
                            onOpen={() => openCategorySlider(index)}
                        />
                    ))}
                </div>

                {showToggleButton ? (
                    <div className='mt-8 hidden justify-center sm:mt-10 sm:flex'>
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
                        images={filteredImages}
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
