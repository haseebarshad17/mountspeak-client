import React from 'react'
import { Route } from 'lucide-react'

import type { TourPage } from './tour-page.types'

type TechnicalRouteBreakdownSectionProps = {
    page: TourPage
}

export function TechnicalRouteBreakdownSection({ page }: TechnicalRouteBreakdownSectionProps) {
    const { technicalRouteSection, theme } = page

    return (
        <section
            id={technicalRouteSection.id}
            className="border-t border-black/[0.06] py-14 sm:py-16"
            style={{ backgroundColor: '#ECECE8' }}
        >
            <div className="agency-container">
                <h2
                    className="max-w-3xl font-heading text-2xl font-semibold tracking-tight sm:text-3xl"
                    style={{ color: theme.primaryColor }}
                >
                    {technicalRouteSection.title}
                </h2>
                <div className="mt-10 grid gap-6 md:grid-cols-3">
                    {technicalRouteSection.segments.map((seg) => (
                        <article
                            key={seg.segmentId}
                            className="flex flex-col rounded-xl border border-black/[0.06] bg-white p-6 shadow-sm"
                        >
                            <Route
                                className="h-6 w-6"
                                style={{ color: theme.secondaryColor }}
                            />
                            <h3 className="mt-4 font-heading text-lg font-semibold text-neutral-900">
                                {seg.title}
                            </h3>
                            <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">
                                {seg.description}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-3 text-xs font-medium text-neutral-500">
                                <span>{seg.distanceKm} km</span>
                                <span className="text-neutral-300">·</span>
                                <span>{seg.estimatedDuration}</span>
                            </div>
                            <ul className="mt-3 flex flex-wrap gap-2">
                                {seg.terrain.map((t) => (
                                    <li
                                        key={t}
                                        className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] text-neutral-600"
                                    >
                                        {t}
                                    </li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
