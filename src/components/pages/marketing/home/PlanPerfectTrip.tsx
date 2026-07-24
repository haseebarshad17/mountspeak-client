'use client'

import { HP_CSS_VARS, STATIC_UI_COLORS } from '@/data/homepage'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import { useTemplateStyles } from '@/components/providers/TemplateStylesProvider'
import { HomepageMediaImage } from '@/components/ui/homepage-media-image'
import { cn } from '@/lib/utils/clsxUtils'
import React from 'react'

const PlanPerfectTrip = ({ page }: HomepagePageProps) => {
    const section = page.sections.planPerfectTrip
    const styles = useTemplateStyles().pages.home.planPerfectTrip

    return (
        <section aria-labelledby='plan-perfect-trip-heading'>
            <div className='agency-container'>
                <div className={cn(styles.grid)}>
                    <div className={cn(styles.media)}>
                        <HomepageMediaImage
                            src={section.image.src}
                            alt={section.image.alt}
                            width={580}
                            height={448}
                            className='h-max w-full max-w-[580px] object-cover'
                        />
                    </div>

                    <div className={cn(styles.copy)}>
                        <span
                            className='text-sm font-semibold uppercase tracking-[0.12em] sm:text-base'
                            style={{ color: HP_CSS_VARS.primary, fontFamily: 'var(--hp-font-body)' }}
                        >
                            {section.eyebrow}
                        </span>

                        <h2
                            id='plan-perfect-trip-heading'
                            className='agency-section-heading pt-1'
                            style={{ color: STATIC_UI_COLORS.title, fontFamily: 'var(--hp-font-heading)' }}
                        >
                            {section.title}
                        </h2>

                        <p
                            className='pt-4 text-sm font-normal leading-6 sm:pt-5 sm:text-base'
                            style={{ color: STATIC_UI_COLORS.text, fontFamily: 'var(--hp-font-body)' }}
                        >
                            {section.paragraph}
                        </p>

                        <dl className={cn(styles.stats)}>
                            {section.stats.map((item) => (
                                <div key={item.value}>
                                    <dt
                                        className='text-2xl font-semibold leading-none sm:text-[28px]'
                                        style={{ color: HP_CSS_VARS.primary, fontFamily: 'var(--hp-font-heading)' }}
                                    >
                                        {item.value}
                                    </dt>
                                    <dd
                                        className='pt-1 text-sm font-normal sm:text-base'
                                        style={{ color: STATIC_UI_COLORS.text, fontFamily: 'var(--hp-font-body)' }}
                                    >
                                        {item.label}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PlanPerfectTrip
