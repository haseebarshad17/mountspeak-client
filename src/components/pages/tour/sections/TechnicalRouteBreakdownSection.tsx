import React from 'react'
import { Map } from 'lucide-react'

import type { TourPage } from './tour-page.types'

type TechnicalRouteBreakdownSectionProps = {
    page: TourPage
}

export function TechnicalRouteBreakdownSection({ page }: TechnicalRouteBreakdownSectionProps) {
    const { technicalRouteSection, theme } = page

    return (
        <section id={technicalRouteSection.id} className="pb-16 sm:pb-20 lg:pb-24" style={{ backgroundColor: theme.backgroundColor }}>
            <div className="agency-container">
                <div className="rounded-2xl bg-[#ECECE8] px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
                    <div className="flex items-start gap-3">
                        <Map className="mt-1 h-5 w-5 shrink-0" style={{ color: theme.secondaryColor }} />
                        <h2 className="font-heading text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
                            {technicalRouteSection.title}
                        </h2>
                    </div>

                    <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
                        {technicalRouteSection.segments.map((seg) => (
                            <article key={seg.segmentId}>
                                <h3
                                    className="text-sm font-semibold leading-snug"
                                    style={{ color: theme.secondaryColor }}
                                >
                                    • {seg.title}
                                </h3>
                                <p className="mt-3 text-sm leading-relaxed text-neutral-600">
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
