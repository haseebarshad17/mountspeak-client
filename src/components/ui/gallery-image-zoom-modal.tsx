'use client'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { StorageMediaImage } from '@/components/ui/storage-media-image'

export type GalleryZoomImage = {
    src: string
    alt: string
}

type GalleryImageZoomModalProps = {
    images: GalleryZoomImage[]
    activeIndex: number
    onClose: () => void
    onNavigate: (index: number) => void
}

export function GalleryImageZoomModal({
    images,
    activeIndex,
    onClose,
    onNavigate,
}: GalleryImageZoomModalProps) {
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
                    <StorageMediaImage
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
