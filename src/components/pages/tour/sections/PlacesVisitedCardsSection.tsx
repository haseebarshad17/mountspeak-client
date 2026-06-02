import React from 'react'
import Image from 'next/image'

import type { TourPage } from './tour-page.types'

type PlacesVisitedCardsSectionProps = {
    page: TourPage
}

export function PlacesVisitedCardsSection({ page }: PlacesVisitedCardsSectionProps) {
    const { placesVisitedSection, theme } = page

    return (
        <section id={placesVisitedSection.id} className="bg-white py-16 sm:py-20 lg:py-24">
            <div className="agency-container">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
                    <div className="shrink-0">
                        <p
                            className="text-xs font-semibold uppercase tracking-[0.2em]"
                            style={{ color: theme.secondaryColor }}
                        >
                            {placesVisitedSection.eyebrow}
                        </p>
                        <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                            {placesVisitedSection.title}
                        </h2>
                    </div>
                    <p className="max-w-md text-sm leading-relaxed text-neutral-600 lg:max-w-lg lg:pt-6 lg:text-base">
                        {placesVisitedSection.intro}
                    </p>
                </div>

                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
                    {placesVisitedSection.cards.map((card) => (
                        <article key={card.id} className="group">
                            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
                                <Image
                                    src={card.thumbnail}
                                    alt={card.title}
                                    fill
                                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                                    sizes="(max-width: 640px) 100vw, 25vw"
                                />
                            </div>
                            <h3 className="mt-4 font-heading text-lg font-semibold text-neutral-900 sm:text-xl">
                                {card.title}
                            </h3>
                            <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">
                                {card.category} • {card.location}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
