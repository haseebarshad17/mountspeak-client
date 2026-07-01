'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
    createContext,
    useContext,
    useRef,
    type ReactNode,
    type RefObject,
} from 'react'
import type { Swiper as SwiperType } from 'swiper'

import { HP_THEME_TEXT_CLASS } from '@/data/homepage'
import { cn } from '@/lib/utils/clsxUtils'

export const swiperSideNavButtonClassName = cn(
    'absolute top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#C0C8C966] bg-white shadow-sm transition hover:border-[var(--hp-color-primary)]/40 disabled:cursor-not-allowed disabled:opacity-40 sm:h-11 sm:w-11',
    HP_THEME_TEXT_CLASS,
)

export type SwiperNavigationRefs = {
    prevRef: RefObject<HTMLButtonElement | null>
    nextRef: RefObject<HTMLButtonElement | null>
}

const SwiperNavigationContext = createContext<SwiperNavigationRefs | null>(null)

export function useSwiperNavigationRefs(): SwiperNavigationRefs {
    const context = useContext(SwiperNavigationContext)

    if (!context) {
        throw new Error('useSwiperNavigationRefs must be used within SwiperSideNavigation')
    }

    return context
}

type SwiperSideNavigationProps = {
    children: ReactNode
    enabled?: boolean
    prevLabel?: string
    nextLabel?: string
    className?: string
    navClassName?: string
}

export function SwiperSideNavigation({
    children,
    enabled = true,
    prevLabel = 'Previous slide',
    nextLabel = 'Next slide',
    className,
    navClassName,
}: SwiperSideNavigationProps) {
    const prevRef = useRef<HTMLButtonElement>(null)
    const nextRef = useRef<HTMLButtonElement>(null)

    return (
        <SwiperNavigationContext.Provider value={{ prevRef, nextRef }}>
            <div className={cn('relative px-11 sm:px-14', className)}>
                {enabled ? (
                    <>
                        <button
                            ref={prevRef}
                            type='button'
                            aria-label={prevLabel}
                            className={cn(swiperSideNavButtonClassName, 'left-0', navClassName)}
                        >
                            <ChevronLeft className='h-5 w-5' aria-hidden />
                        </button>
                        <button
                            ref={nextRef}
                            type='button'
                            aria-label={nextLabel}
                            className={cn(swiperSideNavButtonClassName, 'right-0', navClassName)}
                        >
                            <ChevronRight className='h-5 w-5' aria-hidden />
                        </button>
                    </>
                ) : null}
                {children}
            </div>
        </SwiperNavigationContext.Provider>
    )
}

export function configureSwiperNavigation(
    swiper: SwiperType,
    prevEl: HTMLButtonElement | null,
    nextEl: HTMLButtonElement | null,
) {
    if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
        swiper.params.navigation.prevEl = prevEl
        swiper.params.navigation.nextEl = nextEl
    }
}
