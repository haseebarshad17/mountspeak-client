import React from 'react'
import Image from 'next/image'

import type { TourPage } from './tour-page.types'

type DayByDayItinerarySectionProps = {
    page: TourPage
}

export function DayByDayItinerarySection({ page }: DayByDayItinerarySectionProps) {
    const { itinerarySection, theme } = page
    const days = itinerarySection.days

    return (
        <section
            id={itinerarySection.id}
            className="border-t border-black/[0.06] bg-[#F0F0EC] py-16 sm:py-20 lg:py-24"
        >
            <div className="agency-container">
                <h2 className="text-center font-heading text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                    {itinerarySection.title}
                </h2>

                <div className="relative mx-auto mt-14 max-w-6xl">
                    <div
                        className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-neutral-300 lg:block"
                        aria-hidden
                    />

                    <div className="space-y-16 lg:space-y-24">
                        {days.map((day, index) => {
                            const imageOnRight = index % 2 === 0
                            const isLast = index === days.length - 1
                            const dayLabel = String(day.day).padStart(2, '0')

                            const textBlock = (
                                <div
                                    className={`flex flex-col justify-center lg:px-6 ${
                                        imageOnRight ? 'lg:items-end lg:text-right' : 'lg:items-start lg:text-left'
                                    }`}
                                >
                                    <span
                                        className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white lg:hidden"
                                        style={{ backgroundColor: theme.primaryColor }}
                                    >
                                        {dayLabel}
                                    </span>
                                    <h3 className="font-heading text-xl font-semibold text-neutral-900 sm:text-2xl">
                                        {day.title}
                                    </h3>
                                    <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-600 sm:text-base">
                                        {day.description}
                                    </p>
                                </div>
                            )

                            const visual = (
                                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl sm:aspect-[2/1]">
                                    <Image
                                        src={day.image}
                                        alt={day.alt}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 100vw, 42vw"
                                    />
                                </div>
                            )

                            return (
                                <div
                                    key={day.day}
                                    className="grid items-center gap-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-8"
                                >
                                    {imageOnRight ? (
                                        <>
                                            <div className="lg:pr-2">{textBlock}</div>
                                            <div className="relative hidden flex-col items-center lg:flex">
                                                <span
                                                    className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white"
                                                    style={{ backgroundColor: theme.primaryColor }}
                                                >
                                                    {dayLabel}
                                                </span>
                                                {!isLast ? (
                                                    <span className="mt-2 min-h-[120px] w-px flex-1 bg-neutral-300" />
                                                ) : null}
                                            </div>
                                            <div className="lg:pl-2">{visual}</div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="order-2 lg:order-1 lg:pr-2">{visual}</div>
                                            <div className="relative order-1 hidden flex-col items-center lg:order-2 lg:flex">
                                                <span
                                                    className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white"
                                                    style={{ backgroundColor: theme.primaryColor }}
                                                >
                                                    {dayLabel}
                                                </span>
                                                {!isLast ? (
                                                    <span className="mt-2 min-h-[120px] w-px flex-1 bg-neutral-300" />
                                                ) : null}
                                            </div>
                                            <div className="order-3 lg:order-3 lg:pl-2">{textBlock}</div>
                                        </>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
