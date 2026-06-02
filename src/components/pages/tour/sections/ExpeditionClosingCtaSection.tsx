import React from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils/clsxUtils'

import type { TourPage } from './tour-page.types'

type ExpeditionClosingCtaSectionProps = {
    page: TourPage
}

export function ExpeditionClosingCtaSection({ page }: ExpeditionClosingCtaSectionProps) {
    const { finalCtaSection, theme } = page

    return (
        <section
            id={finalCtaSection.id}
            className="py-20 sm:py-24"
            style={{ backgroundColor: theme.backgroundColor }}
        >
            <div className="agency-container text-center">
                <h2 className="mx-auto max-w-3xl font-heading text-3xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-4xl lg:text-[2.75rem]">
                    {finalCtaSection.title}
                </h2>
                {finalCtaSection.description ? (
                    <p className="mx-auto mt-4 max-w-xl text-neutral-600">
                        {finalCtaSection.description}
                    </p>
                ) : null}
                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    {finalCtaSection.buttons.map((btn) => {
                        const isPrimary = btn.style === 'primary'
                        return (
                            <Link
                                key={btn.label}
                                href={btn.url}
                                className={cn(
                                    'inline-flex min-h-12 min-w-[200px] items-center justify-center rounded-md px-8 text-xs font-bold uppercase tracking-wider transition-colors sm:text-sm',
                                    isPrimary
                                        ? 'text-white shadow-md'
                                        : 'border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50'
                                )}
                                style={
                                    isPrimary
                                        ? {
                                              backgroundColor: theme.secondaryColor,
                                              borderColor: theme.secondaryColor,
                                          }
                                        : undefined
                                }
                            >
                                {btn.label}
                            </Link>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
