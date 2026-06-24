import React from 'react'

import { ExpeditionCtaButtons } from '@/components/pages/tour/sections/ExpeditionCtaButtons'

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

                <ExpeditionCtaButtons
                    buttons={finalCtaSection.buttons}
                    theme={theme}
                    className="mt-10 items-center justify-center"
                />
            </div>
        </section>
    )
}
