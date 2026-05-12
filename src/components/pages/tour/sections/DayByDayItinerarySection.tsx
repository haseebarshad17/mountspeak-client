import React from 'react'
import Image from 'next/image'

import type { TourPage } from './tour-page.types'

type DayByDayItinerarySectionProps = {
    page: TourPage
}

export function DayByDayItinerarySection({ page }: DayByDayItinerarySectionProps) {
    const { itinerarySection, theme } = page

    return (
        <section
            id={itinerarySection.id}
            className="border-t border-black/[0.06] py-16 sm:py-20 lg:py-24"
            style={{ backgroundColor: '#F0F0EC' }}
        >
            <div className="agency-container">
                <h2 className="text-center font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                    {itinerarySection.title}
                </h2>

                <div className="mx-auto mt-14 max-w-5xl space-y-12 lg:space-y-16">
                    {itinerarySection.days.map((day, index) => {
                        const imageOnRight = index % 2 === 0
                        const block = (
                            <div className="flex flex-1 flex-col justify-center lg:px-6">
                                <div className="flex items-center gap-3">
                                    <span
                                        className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                                        style={{ backgroundColor: theme.primaryColor }}
                                    >
                                        {day.day}
                                    </span>
                                    <h3 className="font-heading text-xl font-semibold text-neutral-900 sm:text-2xl">
                                        {day.title}
                                    </h3>
                                </div>
                                <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
                                    {day.description}
                                </p>
                                {day.activities.length > 0 ? (
                                    <ul className="mt-4 space-y-1.5 text-sm text-neutral-600">
                                        {day.activities.map((a) => (
                                            <li key={a} className="flex gap-2">
                                                <span
                                                    className="mt-2 h-1 w-1 shrink-0 rounded-full"
                                                    style={{ backgroundColor: theme.secondaryColor }}
                                                />
                                                {a}
                                            </li>
                                        ))}
                                    </ul>
                                ) : null}
                                <p className="mt-4 text-xs font-medium uppercase tracking-wider text-neutral-500">
                                    Stay:{' '}
                                    <span className="normal-case text-neutral-700">
                                        {day.accommodation}
                                    </span>
                                </p>
                            </div>
                        )
                        const visual = (
                            <div className="relative aspect-[16/11] w-full overflow-hidden rounded-xl lg:aspect-[5/4]">
                                <Image
                                    src={day.image}
                                    alt={day.alt}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            </div>
                        )

                        return (
                            <div
                                key={day.day}
                                className="grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center"
                            >
                                {imageOnRight ? (
                                    <>
                                        {block}
                                        {visual}
                                    </>
                                ) : (
                                    <>
                                        <div className="order-2 lg:order-1">{visual}</div>
                                        <div className="order-1 lg:order-2">{block}</div>
                                    </>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
