'use client'

import type { ReactNode } from 'react'
import { AgencyLink } from '@/components/links/AgencyLink'
import { cn } from '@/lib/utils/cn'

export type ClassicPageHeroAction = {
    label: string
    href: string
    variant?: 'primary' | 'ghost'
}

/** Inset rounded page hero matching homepage temp1 hero chrome. */
export function ClassicPageHero({
    eyebrow,
    title,
    subtitle,
    imageSrc,
    actions,
    children,
    className,
    contentClassName,
    align = 'center',
    size = 'default',
}: {
    eyebrow?: string
    title: string
    subtitle?: string
    imageSrc?: string | null
    actions?: ClassicPageHeroAction[]
    children?: ReactNode
    className?: string
    contentClassName?: string
    align?: 'center' | 'left'
    size?: 'default' | 'tall' | 'compact'
}) {
    const minHeight =
        size === 'tall'
            ? 'min-h-[72vh] md:min-h-[78vh]'
            : size === 'compact'
              ? 'min-h-[320px] md:min-h-[380px]'
              : 'min-h-[52vh] md:min-h-[58vh]'

    return (
        <div className={cn('p-3 sm:p-5 pb-0 sm:pb-0', className)}>
            <section
                className={cn(
                    'relative overflow-hidden rounded-2xl bg-[var(--color-brand)] text-white',
                    minHeight
                )}
            >
                {imageSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={imageSrc}
                        alt=""
                        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                    />
                ) : (
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--color-brand)] via-[color-mix(in_srgb,var(--color-brand)_70%,#0B2E2C)] to-[#071E1C]" />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/70" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.12),transparent_55%)]" />

                <div
                    className={cn(
                        'relative flex h-full flex-col justify-end pb-12 pt-28 md:pb-16 md:pt-36',
                        minHeight,
                        contentClassName
                    )}
                >
                    <div
                        className={cn(
                            'site-container',
                            align === 'center' ? 'text-center' : 'text-left'
                        )}
                    >
                        {eyebrow ? (
                            <p className="text-sm font-medium uppercase text-white/70">
                                {eyebrow}
                            </p>
                        ) : null}
                        <h1
                            className={cn(
                                'mt-3 font-bold leading-[1.1] tracking-tight',
                                align === 'center'
                                    ? 'mx-auto max-w-3xl text-[2.1rem] md:text-5xl lg:text-[3.25rem]'
                                    : 'max-w-3xl text-[2.1rem] md:text-5xl lg:text-[3.1rem]'
                            )}
                        >
                            {title}
                        </h1>
                        {subtitle ? (
                            <p
                                className={cn(
                                    'mt-4 text-sm leading-relaxed text-white/80 md:text-base',
                                    align === 'center'
                                        ? 'mx-auto max-w-2xl'
                                        : 'max-w-xl'
                                )}
                            >
                                {subtitle}
                            </p>
                        ) : null}

                        {actions && actions.length > 0 ? (
                            <div
                                className={cn(
                                    'mt-8 flex flex-wrap gap-3',
                                    align === 'center' && 'justify-center'
                                )}
                            >
                                {actions.map((action) => (
                                    <AgencyLink
                                        key={action.href + action.label}
                                        href={action.href}
                                        className={cn(
                                            'inline-flex rounded-full px-5 py-2.5 text-sm font-medium transition',
                                            action.variant === 'ghost'
                                                ? 'border border-white/35 text-white hover:bg-white/10'
                                                : 'bg-white text-[var(--color-brand)] hover:bg-white/90'
                                        )}
                                    >
                                        {action.label}
                                    </AgencyLink>
                                ))}
                            </div>
                        ) : null}

                        {children}
                    </div>
                </div>
            </section>
        </div>
    )
}
