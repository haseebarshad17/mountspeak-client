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
            className="py-10 sm:py-[120px]"
            style={{ backgroundColor: theme.backgroundColor }}
        >
            <div className="agency-container text-center !px-16">
                <h2 className="mx-auto max-w-3xl font-noto text-3xl font-bold  text-[#191C1C] sm:text-4xl lg:text-[48px] lg:leading-[57px]">
                    {finalCtaSection.title}
                </h2>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    {finalCtaSection.buttons.map((btn) => {
                        const isPrimary = btn.style === 'primary'
                        return (
                            <Link
                                key={btn.label}
                                href={btn.url}
                                className={cn(
                                    'inline-flex min-h-[58px] w-full max-w-[257px] font-manrope items-center justify-center  px-8 text-xs uppercase  transition-colors sm:text-base',
                                    isPrimary
                                        ? 'text-white shadow-md'
                                        : 'border border-[#737879] bg-white text-neutral-900 hover:bg-neutral-50'
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
