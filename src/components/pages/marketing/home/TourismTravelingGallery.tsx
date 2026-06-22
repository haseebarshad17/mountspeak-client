'use client'

import { HP_THEME_BTN_CLASS, HP_THEME_BTN_STYLE, STATIC_UI_COLORS } from '@/data/homepage'
import { FilterPills } from '@/components/pages/marketing/home/filter-pills'
import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import { Button } from '@/components/ui/button'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import { cn } from '@/lib/utils/clsxUtils'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

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

function GalleryImageZoomModal({
    images,
    activeIndex,
    onClose,
    onNavigate,
}: {
    images: GalleryImage[]
    activeIndex: number
    onClose: () => void
    onNavigate: (index: number) => void
}) {
    const [mounted, setMounted] = useState(false)
    const image = images[activeIndex]
    const canNavigate = images.length > 1

    const goToPrevious = useCallback(() => {
        onNavigate(activeIndex === 0 ? images.length - 1 : activeIndex - 1)
    }, [activeIndex, images.length, onNavigate])

    const goToNext = useCallback(() => {
        onNavigate(activeIndex === images.length - 1 ? 0 : activeIndex + 1)
    }, [activeIndex, images.length, onNavigate])

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose()
                return
            }

            if (!canNavigate) return

            if (event.key === 'ArrowLeft') goToPrevious()
            if (event.key === 'ArrowRight') goToNext()
        }

        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', onKeyDown)

        return () => {
            document.body.style.overflow = ''
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [canNavigate, goToNext, goToPrevious, onClose])

    if (!mounted || !image) return null

    return createPortal(
        <div
            className='fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8'
            role='dialog'
            aria-modal='true'
            aria-label={image.alt}
        >
            <button
                type='button'
                className='absolute inset-0 bg-black/85'
                onClick={onClose}
                aria-label='Close image preview'
            />

            {canNavigate ? (
                <button
                    type='button'
                    onClick={(event) => {
                        event.stopPropagation()
                        goToPrevious()
                    }}
                    className='absolute left-3 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white transition hover:bg-black/60 sm:left-6'
                    aria-label='Previous image'
                >
                    <ChevronLeft className='h-5 w-5' aria-hidden />
                </button>
            ) : null}

            {canNavigate ? (
                <button
                    type='button'
                    onClick={(event) => {
                        event.stopPropagation()
                        goToNext()
                    }}
                    className='absolute right-3 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white transition hover:bg-black/60 sm:right-6'
                    aria-label='Next image'
                >
                    <ChevronRight className='h-5 w-5' aria-hidden />
                </button>
            ) : null}

            <div
                className='relative z-10 w-full max-w-[min(92vw,960px)]'
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type='button'
                    onClick={onClose}
                    className='absolute -top-2 right-0 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:-top-12'
                    aria-label='Close'
                >
                    <X className='h-5 w-5' aria-hidden />
                </button>

                <div className='relative mx-auto h-[min(78vh,720px)] w-full overflow-hidden rounded-xl bg-black/20'>
                    <Image
                        key={`${image.src}-${activeIndex}`}
                        src={image.src}
                        alt={image.alt}
                        fill
                        className='object-contain'
                        sizes='92vw'
                        priority
                    />
                </div>

                <div className='mt-4 text-center'>
                    {image.alt ? (
                        <p className='text-sm text-white/90 sm:text-base'>{image.alt}</p>
                    ) : null}
                    {canNavigate ? (
                        <p className='mt-1 text-xs text-white/60'>
                            {activeIndex + 1} / {images.length}
                        </p>
                    ) : null}
                </div>
            </div>
        </div>,
        document.body,
    )
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
            <Image
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
