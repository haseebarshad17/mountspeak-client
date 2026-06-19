import React from 'react'

import { TourMediaImage } from '@/components/pages/tour/TourMediaImage'

import type { TourPage } from './tour-page.types'

type PlacesVisitedCardsSectionProps = {
    page: TourPage
}

export function PlacesVisitedCardsSection({ page }: PlacesVisitedCardsSectionProps) {
    const { placesVisitedSection, theme } = page

    return (
        <section id={placesVisitedSection.id} className="bg-white py-8 sm:py-10 lg:py-16 ">
            <div className="agency-container !px-16">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
                    <div className="shrink-0">
                        <p
                            className="text-base font-roboto uppercase"
                            style={{ color: theme.secondaryColor }}
                        >
                            {placesVisitedSection.eyebrow}
                        </p>
                        <h2 className="mt-2 font-heading text-3xl font-heading font-semibold tracking-tight text-[#191C1C] sm:text-4xl">
                            {placesVisitedSection.title}
                        </h2>
                    </div>
                    <p className="lg:max-w-md text-sm leading-relaxed text-[#434849] lg:pt-6 lg:text-base">
                        {placesVisitedSection.intro}
                    </p>
                </div>

                <div className="mt-[35px] grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
                    {placesVisitedSection.cards.map((card) => (
                        <article key={card.id} className="group">
                            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
                                <TourMediaImage
                                    src={card.thumbnail}
                                    alt={card.title}
                                    fill
                                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                                    sizes="(max-width: 640px) 100vw, 25vw"
                                />
                            </div>
                            <h3 className="mt-4 font-heading font-heading text-lg font-semibold text-[#191C1C] sm:text-xl">
                                {card.title}
                            </h3>
                            <p className="mt-1.5 text-xs font-medium font-roboto uppercase  text-[#434849]">
                                {card.category} • {card.location}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
