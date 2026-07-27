'use client'

import { cn } from '@/lib/utils/clsxUtils'
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type PointerEvent as ReactPointerEvent,
    type ReactNode,
} from 'react'

const AUTOSCROLL_MS = 5000
const FADE_MS = 900
const DRAG_THRESHOLD_PX = 48

type HeroBackgroundSliderProps = {
    images: string[]
    className?: string
    bannerClassName?: string
    overlayClassName?: string
    children: ReactNode
}

function isInteractiveTarget(target: EventTarget | null): boolean {
    if (!(target instanceof Element)) return false
    return Boolean(
        target.closest(
            '[data-hero-pagination], button, a, input, textarea, select, label, [role="button"]',
        ),
    )
}

/**
 * Content-height hero media layer with crossfade + pointer drag.
 * Children should use `pointer-events-none` with interactive islands as `pointer-events-auto`.
 */
export function HeroBackgroundSlider({
    images,
    className,
    bannerClassName,
    overlayClassName,
    children,
}: HeroBackgroundSliderProps) {
    const slides = useMemo(
        () => images.map((src) => src.trim()).filter(Boolean),
        // eslint-disable-next-line react-hooks/exhaustive-deps -- compare by value
        [images.join('|')],
    )
    const canSlide = slides.length > 1
    const [activeIndex, setActiveIndex] = useState(0)
    const dragStartX = useRef<number | null>(null)
    const pauseAutoplayUntil = useRef(0)

    const goTo = useCallback(
        (index: number) => {
            if (!canSlide) return
            const len = slides.length
            setActiveIndex(((index % len) + len) % len)
        },
        [canSlide, slides.length],
    )

    const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])
    const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])

    useEffect(() => {
        setActiveIndex(0)
    }, [slides])

    useEffect(() => {
        if (!canSlide) return

        const timer = window.setInterval(() => {
            if (Date.now() < pauseAutoplayUntil.current) return
            setActiveIndex((current) => (current + 1) % slides.length)
        }, AUTOSCROLL_MS)

        return () => window.clearInterval(timer)
    }, [canSlide, slides])

    const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (!canSlide || event.button !== 0) return
        if (isInteractiveTarget(event.target)) return

        dragStartX.current = event.clientX
        event.currentTarget.setPointerCapture(event.pointerId)
    }

    const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (dragStartX.current == null) return
        const dx = event.clientX - dragStartX.current
        dragStartX.current = null

        try {
            event.currentTarget.releasePointerCapture(event.pointerId)
        } catch {
            /* already released */
        }

        if (!canSlide || Math.abs(dx) < DRAG_THRESHOLD_PX) return

        pauseAutoplayUntil.current = Date.now() + AUTOSCROLL_MS
        if (dx < 0) goNext()
        else goPrev()
    }

    return (
        <section className={cn(className)}>
            <div
                className={cn(
                    'agency-hero-banner relative isolate overflow-hidden select-none',
                    canSlide && 'cursor-grab active:cursor-grabbing touch-pan-y',
                    bannerClassName,
                )}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
            >
                {slides.map((src, index) => (
                    <div
                        key={`${src}-${index}`}
                        className={cn(
                            'pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity ease-out',
                            index === activeIndex ? 'opacity-100' : 'opacity-0',
                        )}
                        style={{
                            backgroundImage: `url("${src}")`,
                            transitionDuration: `${FADE_MS}ms`,
                        }}
                        aria-hidden
                    />
                ))}

                <div
                    className={cn('pointer-events-none absolute inset-0 z-[1]', overlayClassName)}
                    aria-hidden
                />

                <div className='pointer-events-none relative z-10 select-none'>{children}</div>

                {canSlide ? (
                    <div
                        data-hero-pagination
                        className='pointer-events-auto absolute bottom-4 left-0 right-0 z-20 flex items-center justify-center gap-1.5 sm:bottom-5'
                        onPointerDown={(event) => event.stopPropagation()}
                    >
                        {slides.map((_, index) => (
                            <button
                                key={`dot-${index}`}
                                type='button'
                                aria-label={`Go to slide ${index + 1}`}
                                aria-current={index === activeIndex}
                                className={cn(
                                    'h-2 rounded-full bg-white/40 transition-all duration-300',
                                    index === activeIndex ? 'w-7 bg-white' : 'w-2 hover:bg-white/70',
                                )}
                                onClick={() => {
                                    pauseAutoplayUntil.current = Date.now() + AUTOSCROLL_MS
                                    goTo(index)
                                }}
                            />
                        ))}
                    </div>
                ) : null}
            </div>
        </section>
    )
}
