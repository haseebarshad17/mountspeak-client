import React from 'react'

import { TourMediaImage } from '@/components/pages/tour/TourMediaImage'

import type { TourPage } from './tour-page.types'

type StayAndDineCardsSectionProps = {
    page: TourPage
}

export function StayAndDineCardsSection({ page }: StayAndDineCardsSectionProps) {
    const { stayAndDineSection, theme } = page

    return (
        <section
            id={stayAndDineSection.id}
            className="bg-white py-8 sm:py-10 lg:py-16"
            style={{ color: theme.textColor }}
        >
            <div className="agency-container px-4 sm:px-8 lg:px-16">
                <h2 className="font-heading text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl">
                    {stayAndDineSection.title}
                </h2>

                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                    {stayAndDineSection.properties.map((prop) => (
                        <article key={prop.id} className="flex flex-col">
                            <div className="relative h-[220px] w-full overflow-hidden rounded-2xl sm:h-[256px]">
                                <TourMediaImage
                                    src={prop.thumbnail}
                                    alt={prop.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 368px"
                                />
                            </div>
                            <div className="flex flex-1 flex-col pt-5">
                                <p className="text-base font-roboto font-bold uppercase text-[#506449]">
                                    {prop.type}
                                </p>
                                <h3 className="mt-2 font-heading text-2xl font-semibold text-[#191C1C] font-heading">
                                    {prop.name}
                                </h3>
                                <p className="mt-2 flex-1 text-sm  text-[#434849] font-roboto">
                                    {prop.description}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {prop.amenities.slice(0, 2).map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded border border-[#737879] px-2.5 py-1 text-[10px] leading-4 font-semibold uppercase text-[#191C1C"
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
