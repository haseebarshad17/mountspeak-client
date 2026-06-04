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
            <div className="agency-container !px-16">
                <div className="rounded-2xl bg-[#ECECE8] px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
                    <div className="flex items-start gap-3">
                        <Map className="mt-1 h-5 w-5 shrink-0" style={{ color: theme.secondaryColor }} />
                        <h2 className="font-heading text-xl font-noto font-semibold tracking-tight text-[#191C1C] sm:text-2xl">
                            {technicalRouteSection.title}
                        </h2>
                    </div>

                    <div className="mt-8 grid gap-8 md:grid-cols-3 md:gap-10">
                        {technicalRouteSection.segments.map((seg) => (
                            <article key={seg.segmentId} className='max-w-[340px]'>
                                <h3 className="relative pl-6 text-base font-manrope font-semibold leading-snug text-[#F0602B]">
                                    <span
                                        aria-hidden
                                        className="absolute font-manrope left-0 top-[0.45em] rounded-full bg-[#F0602B]"
                                        style={{ width: 10, height: 10, minWidth: 10, minHeight: 10 }}
                                    />
                                    {seg.title}
                                </h3>
                                <p className="mt-4 text-[14px] leading-5 font-manrope text-[#434849]">
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
