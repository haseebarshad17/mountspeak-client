import React from 'react'

import { TourMediaImage } from '@/components/pages/tour/TourMediaImage'

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
            className=" bg-[#F3F4F3] py-8 sm:py-10 lg:pt-16 lg:pb-[112px]"
        >
            <div className="agency-container">
                <h2 className="text-center font-heading text-2xl font-bold tracking-tight text-[#191C1C] sm:text-3xl lg:text-4xl">
                    {itinerarySection.title}
                </h2>

                <div className="relative mx-auto mt-8 max-w-6xl sm:mt-12 lg:mt-14">
                    <div
                        className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-neutral-300 lg:block"
                        aria-hidden
                    />

                    <div className="space-y-8 sm:space-y-10 lg:space-y-[56px]">
                        {days.map((day, index) => {
                            const imageOnRight = index % 2 === 0
                            const isLast = index === days.length - 1
                            const dayLabel = String(day.day).padStart(2, '0')

                            const textBlock = (
                                <div
                                    className={`order-2 flex flex-col justify-center text-center lg:order-none lg:px-6 ${
                                        imageOnRight ? 'lg:items-end lg:text-right' : 'lg:items-start lg:text-left'
                                    }`}
                                >
                                    <span
                                        className="mb-4 flex h-9 w-9 items-center justify-center self-center rounded-full text-xs font-bold text-white lg:hidden"
                                        style={{ backgroundColor: theme.primaryColor }}
                                    >
                                        {dayLabel}
                                    </span>
                                    <h3 className="font-heading text-xl font-semibold text-neutral-900 sm:text-2xl">
                                        {day.title}
                                    </h3>
                                    <p className="mx-auto mt-4 max-w-md text-sm font-roboto leading-normal text-[#434849] sm:text-base lg:mx-0">
                                        {day.description}
                                    </p>
                                </div>
                            )

                            const visual = (
                                <div className="relative order-1 h-[180px] w-full max-w-full overflow-hidden rounded-2xl sm:h-[192px] lg:order-none lg:max-w-[516px]">
                                    <TourMediaImage
                                        src={day.image}
                                        alt={day.alt}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 100vw, 516px"
                                    />
                                </div>
                            )

                            return (
                                <div
                                    key={day.day}
                                    className="grid gap-6 sm:gap-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-8"
                                >
                                    {imageOnRight ? (
                                        <>
                                            <div className="order-2 w-full max-w-xl justify-self-start lg:order-none lg:pr-2">{textBlock}</div>
                                            <div className="relative hidden flex-col items-center justify-self-center lg:flex">
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
                                            <div className="order-1 w-full max-w-xl justify-self-end lg:order-none lg:pl-2">{visual}</div>
                                        </>
                                    ) : (
                                        <>
                                                <div className="order-1 w-full max-w-xl justify-self-start lg:order-none lg:pr-2">{visual}</div>
                                                <div className="relative hidden flex-col items-center justify-self-center lg:flex">
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
                                                <div className="order-2 w-full max-w-xl justify-self-end lg:order-none lg:pl-2">{textBlock}</div>
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
