import React from 'react'
import { Map } from 'lucide-react'

import type { TourPage } from './tour-page.types'

type TechnicalRouteBreakdownSectionProps = {
    page: TourPage
}

export function TechnicalRouteBreakdownSection({ page }: TechnicalRouteBreakdownSectionProps) {
    const { technicalRouteSection, theme } = page

    return (
        <section id={technicalRouteSection.id} className="pb-8 sm:pb-10 lg:pb-16 " style={{ backgroundColor: theme.backgroundColor }}>
            <div className="agency-container px-4 sm:px-8 lg:px-16">
                <div className="rounded-2xl bg-[#ECECE8] px-4 py-6 sm:px-8 sm:py-10 lg:px-10">
                    <div className="flex items-start gap-3">
                        <Map className="mt-0.5 h-5 w-5 shrink-0" style={{ color: theme.secondaryColor }} />
                        <h2 className="min-w-0 flex-1 font-heading text-base font-semibold leading-snug tracking-tight text-[#191C1C] sm:text-xl lg:text-2xl">
                            {technicalRouteSection.title}
                        </h2>
                    </div>

                    <div className="mt-6 grid gap-6 sm:mt-8 sm:gap-8 md:grid-cols-3 md:gap-10">
                        {technicalRouteSection.segments.map((seg) => (
                            <article key={seg.segmentId} className="w-full max-w-full">
                                <h3
                                    className="relative pl-6 text-sm font-roboto font-semibold leading-snug sm:text-base"
                                    style={{ color: theme.secondaryColor }}
                                >
                                    <span
                                        aria-hidden
                                        className="absolute left-0 top-[0.45em] rounded-full font-roboto"
                                        style={{
                                            width: 10,
                                            height: 10,
                                            minWidth: 10,
                                            minHeight: 10,
                                            backgroundColor: theme.secondaryColor,
                                        }}
                                    />
                                    {seg.title}
                                </h3>
                                <p className="mt-4 text-[14px] leading-5 font-roboto text-[#434849]">
                                    {seg.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
