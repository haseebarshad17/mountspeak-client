import React from 'react'

import { TourMediaImage } from '@/components/pages/tour/TourMediaImage'

import { ExpeditionCtaButtons } from '@/components/pages/tour/sections/ExpeditionCtaButtons'

import type { TourPage } from './tour-page.types'

type ExpeditionOverviewSectionProps = {
    page: TourPage
}

export function ExpeditionOverviewSection({ page }: ExpeditionOverviewSectionProps) {
    const { overviewSection, finalCtaSection, theme } = page

    return (
        <section
            id={overviewSection.id}
            className="pt-8 sm:pt-10 lg:pt-16"
            style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
        >
            <div className="agency-container px-4 pb-4 sm:px-8 sm:pb-8 lg:px-16 lg:pb-16">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
                    <div>
                        <h2 className="font-heading text-xl font-bold tracking-tight text-[#191C1C] sm:text-2xl lg:text-4xl lg:leading-10">
                            {overviewSection.title}
                        </h2>
                        <p className="font-roboto mt-6 max-w-xl text-base font-normal leading-normal text-[#434849] lg:text-lg">
                            {overviewSection.description}
                        </p>

                        <ExpeditionCtaButtons
                            buttons={finalCtaSection.buttons.filter((btn) => btn.style === 'primary')}
                            theme={theme}
                            tourSlug={page.slug}
                            listingKind={page.listingKind}
                            className="mt-8 sm:mt-10"
                            bookingClosed={page.isBookingClosed === true}
                        />
                    </div>

                    <div className="relative aspect-square w-full max-w-full overflow-hidden border border-black/[0.08] bg-neutral-100 shadow-sm sm:h-[442px] sm:w-[442px] sm:max-w-[442px] sm:aspect-auto">
                        <div className="relative h-full w-full">
                            <TourMediaImage
                                src={overviewSection.sideCard.image}
                                alt={overviewSection.sideCard.alt}
                                fill
                                className="object-cover"
                                sizes="(max-width: 639px) 100vw, 442px"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
