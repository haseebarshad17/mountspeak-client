'use client'

import { useCallback, useState } from 'react'

import { TourMediaImage } from '@/components/pages/tour/TourMediaImage'
import { GalleryImageZoomModal } from '@/components/ui/gallery-image-zoom-modal'
import { cn } from '@/lib/utils/clsxUtils'

import type { TourPage } from './tour-page.types'

type VisualFragmentsGallerySectionProps = {
    page: TourPage
}

const galleryImageClass =
    'object-cover grayscale transition-[filter,transform] duration-300 group-hover:grayscale-0 group-hover:scale-105'

function GalleryTile({
    src,
    alt,
    sizes,
    className,
    onOpen,
}: {
    src: string
    alt: string
    sizes: string
    className?: string
    onOpen: () => void
}) {
    return (
        <button
            type='button'
            onClick={onOpen}
            className={cn(
                'group relative overflow-hidden rounded-2xl cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#091416]',
                className,
            )}
            aria-label={`View larger image: ${alt}`}
        >
            <TourMediaImage
                src={src}
                alt={alt}
                fill
                className={galleryImageClass}
                sizes={sizes}
            />
        </button>
    )
}

export function VisualFragmentsGallerySection({ page }: VisualFragmentsGallerySectionProps) {
    const { gallerySection } = page
    const media = gallerySection.media
    const heroShot = media[0]
    const topRight = media[1]
    const bottomRight = media[2]
    const wideBottom = media[3]
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

    const zoomImages = media.map((item) => ({ src: item.src, alt: item.alt }))
    const closeImageModal = useCallback(() => setSelectedImageIndex(null), [])

    return (
        <section
            id={gallerySection.id}
            className='min-h-[860px] py-8 sm:py-10 lg:py-16'
            style={{ backgroundColor: '#091416', color: '#F5F5F2' }}
        >
            <div className='agency-container !px-16'>
                <div>
                    <p className='font-roboto text-base uppercase tracking-[0.1em] text-readable-uppercase text-[#D2E9C7]'>
                        {gallerySection.eyebrow}
                    </p>
                    <h2 className='mt-4 font-heading text-3xl font-bold text-white sm:text-4xl'>
                        {gallerySection.title}
                    </h2>
                </div>

                {heroShot ? (
                    <div className='mt-12 grid gap-4 lg:grid-cols-[1.4fr_1fr] lg:gap-5'>
                        <GalleryTile
                            src={heroShot.src}
                            alt={heroShot.alt}
                            sizes='(max-width: 1024px) 100vw, 55vw'
                            className='min-h-[300px] lg:min-h-[480px]'
                            onOpen={() => setSelectedImageIndex(0)}
                        />
                        <div className='grid grid-cols-2 gap-4 lg:gap-5'>
                            {topRight ? (
                                <GalleryTile
                                    src={topRight.src}
                                    alt={topRight.alt}
                                    sizes='(max-width: 1024px) 50vw, 22vw'
                                    className='aspect-square'
                                    onOpen={() => setSelectedImageIndex(1)}
                                />
                            ) : null}
                            {bottomRight ? (
                                <GalleryTile
                                    src={bottomRight.src}
                                    alt={bottomRight.alt}
                                    sizes='(max-width: 1024px) 50vw, 22vw'
                                    className='aspect-square'
                                    onOpen={() => setSelectedImageIndex(2)}
                                />
                            ) : null}
                            {wideBottom ? (
                                <GalleryTile
                                    src={wideBottom.src}
                                    alt={wideBottom.alt}
                                    sizes='(max-width: 1024px) 100vw, 45vw'
                                    className='col-span-2 aspect-[21/9] sm:aspect-[16/7]'
                                    onOpen={() => setSelectedImageIndex(3)}
                                />
                            ) : null}
                        </div>
                    </div>
                ) : null}
            </div>

            {selectedImageIndex !== null ? (
                <GalleryImageZoomModal
                    images={zoomImages}
                    activeIndex={selectedImageIndex}
                    onClose={closeImageModal}
                    onNavigate={setSelectedImageIndex}
                />
            ) : null}
        </section>
    )
}
