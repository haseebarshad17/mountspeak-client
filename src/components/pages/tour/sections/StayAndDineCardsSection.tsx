import React from 'react'
import Image from 'next/image'

import type { TourPage } from './tour-page.types'

type StayAndDineCardsSectionProps = {
    page: TourPage
}

export function StayAndDineCardsSection({ page }: StayAndDineCardsSectionProps) {
    const { stayAndDineSection, theme } = page

    return (
        <section
            id={stayAndDineSection.id}
            className="bg-white py-16 sm:py-20 lg:py-24"
            style={{ color: theme.textColor }}
        >
            <div className="agency-container">
                <h2 className="font-heading text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                    {stayAndDineSection.title}
                </h2>

                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                    {stayAndDineSection.properties.map((prop) => (
                        <article key={prop.id} className="flex flex-col">
                            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
                                <Image
                                    src={prop.thumbnail}
                                    alt={prop.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 33vw"
                                />
                            </div>
                            <div className="flex flex-1 flex-col pt-5">
                                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500">
                                    {prop.type}
                                </p>
                                <h3 className="mt-2 font-heading text-xl font-semibold text-neutral-900">
                                    {prop.name}
                                </h3>
                                <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">
                                    {prop.description}
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {prop.amenities.slice(0, 2).map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded border border-neutral-300 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-600"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
