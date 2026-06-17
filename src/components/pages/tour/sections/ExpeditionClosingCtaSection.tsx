import React from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
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
                <h2 className="mx-auto max-w-3xl font-heading text-3xl font-bold  text-[#191C1C] sm:text-4xl lg:text-[48px] lg:leading-[57px]">
                    {finalCtaSection.title}
                </h2>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    {finalCtaSection.buttons.map((btn) => {
                        const isPrimary = btn.style === 'primary'
                        return (
                            <Button
                                key={btn.label}
                                asChild
                                variant={isPrimary ? 'default' : 'outline'}
                                className={cn(
                                    'w-full max-w-[257px]',
                                    !isPrimary && 'border-[#737879] text-neutral-900 hover:bg-neutral-50',
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
                                <Link href={btn.url}>{btn.label}</Link>
                            </Button>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
