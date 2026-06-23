import { cn } from '@/lib/utils/clsxUtils'
import type { ReactNode } from 'react'

export const PAGE_HERO_OVERLAY_CLASS = 'absolute inset-0 bg-black/15'

export const PAGE_HERO_BANNER_HEIGHT_CLASS =
    'h-[400px]'

export const PAGE_HERO_BANNER_HEIGHT_TALL_CLASS =
    'h-[560px] sm:h-[600px] md:h-[660px] lg:h-[720px]'

export const PAGE_HERO_CONTENT_CLASS =
    'flex h-full flex-col justify-center px-4 pt-[100px] text-center text-white sm:px-6 sm:pt-[108px] md:pt-[112px]'

type PageHeroBannerProps = {
    backgroundImage: string
    children: ReactNode
    className?: string
    bannerClassName?: string
    overlayClassName?: string
    /** Fixed banner height for inner pages (homepage stays fluid). */
    fixedHeight?: boolean | 'tall'
}

export function PageHeroBanner({
    backgroundImage,
    children,
    className,
    bannerClassName,
    overlayClassName,
    fixedHeight = false,
}: PageHeroBannerProps) {
    const heightClass =
        fixedHeight === 'tall'
            ? PAGE_HERO_BANNER_HEIGHT_TALL_CLASS
            : fixedHeight
              ? PAGE_HERO_BANNER_HEIGHT_CLASS
              : undefined

    return (
        <section className={cn('p-2 sm:p-3 md:p-4 lg:p-5', className)}>
            <div
                className={cn(
                    'relative overflow-hidden rounded-[16px] bg-cover bg-center bg-no-repeat',
                    heightClass,
                    bannerClassName,
                )}
                style={{ backgroundImage: `url("${backgroundImage}")` }}
            >
                <div className={cn(PAGE_HERO_OVERLAY_CLASS, overlayClassName)} aria-hidden />
                <div
                    className={cn(
                        'relative z-10',
                        fixedHeight && 'h-full',
                    )}
                >
                    {children}
                </div>
            </div>
        </section>
    )
}
