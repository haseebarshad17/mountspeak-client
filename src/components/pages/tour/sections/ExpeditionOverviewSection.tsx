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
            style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
        >
            <div className="agency-container p-8 sm:p-10 lg:p-16">
                <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
                    <div>
                        <h2 className="font-heading text-2xl font-bold tracking-tight text-[#191C1C] sm:text-3xl lg:text-4xl lg:leading-10">
                            {overviewSection.title}
                        </h2>
                        <p className="font-roboto mt-6 max-w-xl text-base font-normal leading-relaxed text-[#434849] lg:text-lg">
                            {overviewSection.description}
                        </p>

                        <dl className="mt-10 grid gap-8 border-t border-[#C3C7C8] pt-6 sm:grid-cols-2">
                            {overviewSection.statistics.map((stat) => (
                                <div key={stat.label}>
                                    <dt className="text-base font-roboto font-normal uppercase tracking-wider text-[#434849]">
                                        {stat.label}
                                    </dt>
                                    <dd className="mt-2 font-heading font-heading text-2xl font-semibold text-[#191C1C]">
                                        {stat.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>

                        <ExpeditionCtaButtons
                            buttons={finalCtaSection.buttons.filter((btn) => btn.style === 'primary')}
                            theme={theme}
                            className="mt-10"
                        />
                    </div>

                    <div className="relative h-[442px] w-[442px] overflow-hidden border border-black/[0.08] bg-neutral-100 shadow-sm">
                        <div className="relative h-full w-full">
                            <TourMediaImage
                                src={overviewSection.sideCard.image}
                                alt={overviewSection.sideCard.alt}
                                fill
                                className="object-cover"
                                sizes="442px"
                            />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center p-6">
                            <span className="font-roboto bg-white max-w-[211px] min-h-[24px] py-4 w-full flez justify-center text-center text-base font-semibold uppercase tracking-[0.12em] text-[#091416] shadow-md">
                                {overviewSection.sideCard.title}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
