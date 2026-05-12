import React from 'react'
import Image from 'next/image'

import type { TourPage } from './tour-page.types'

type PlacesVisitedCardsSectionProps = {
    page: TourPage
}

export function PlacesVisitedCardsSection({ page }: PlacesVisitedCardsSectionProps) {
    const { placesVisitedSection, theme } = page

    return (
        <section
            id={placesVisitedSection.id}
            className="py-16 sm:py-20 lg:py-24"
            style={{
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
            }}
        >
            <div className="agency-container">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                            {placesVisitedSection.eyebrow}
                        </p>
                        <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                            {placesVisitedSection.title}
                        </h2>
                    </div>
                    <p className="max-w-xl text-sm leading-relaxed text-neutral-700 lg:text-right lg:text-base">
                        {placesVisitedSection.intro}
                    </p>
                </div>

                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {placesVisitedSection.cards.map((card) => (
                        <article
                            key={card.id}
                            className="group flex flex-col overflow-hidden rounded-xl border border-black/[0.06] bg-white shadow-sm"
                        >
                            <div className="relative aspect-[4/5] w-full overflow-hidden">
                                <Image
                                    src={card.thumbnail}
                                    alt={card.title}
                                    fill
                                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                                    sizes="(max-width: 640px) 100vw, 25vw"
                                />
                            </div>
                            <div className="flex flex-1 flex-col p-4">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                                    {card.category}
                                </p>
                                <h3 className="mt-1 font-heading text-lg font-semibold text-neutral-900">
                                    {card.title}
                                </h3>
                                <p className="mt-1 text-xs text-neutral-500">{card.location}</p>
                                <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                                    {card.description}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
