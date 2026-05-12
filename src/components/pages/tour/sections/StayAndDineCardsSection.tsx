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
            className="py-16 sm:py-20 lg:py-24"
            style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
        >
            <div className="agency-container">
                <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                    {stayAndDineSection.title}
                </h2>

                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {stayAndDineSection.properties.map((prop) => (
                        <article
                            key={prop.id}
                            className="flex flex-col overflow-hidden rounded-xl border border-black/[0.06] bg-white shadow-sm"
                        >
                            <div className="relative aspect-[16/10] w-full">
                                <Image
                                    src={prop.thumbnail}
                                    alt={prop.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 33vw"
                                />
                            </div>
                            <div className="flex flex-1 flex-col p-5">
                                <p
                                    className="text-[10px] font-bold uppercase tracking-[0.15em]"
                                    style={{ color: theme.secondaryColor }}
                                >
                                    {prop.type}
                                </p>
                                <h3 className="mt-2 font-heading text-xl font-semibold text-neutral-900">
                                    {prop.name}
                                </h3>
                                <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">
                                    {prop.description}
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {prop.amenities.slice(0, 4).map((a) => (
                                        <span
                                            key={a}
                                            className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] text-neutral-600"
                                        >
                                            {a}
                                        </span>
                                    ))}
                                </div>
                                <p className="mt-4 text-sm font-medium text-neutral-800">
                                    ★ {prop.rating.toFixed(1)}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
