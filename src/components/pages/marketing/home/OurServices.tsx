'use client'

import { HP_THEME_LINK_CLASS, STATIC_UI_COLORS } from '@/data/homepage'

import { PrefixedLink } from '@/components/ui/prefixed-link'
import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import { useTemplateStyles } from '@/components/providers/TemplateStylesProvider'
import { cn } from '@/lib/utils/clsxUtils'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import React from 'react'
import { ServiceCard } from './ServiceCard'
import { ArrowRightIcon } from 'lucide-react'

const OurServices = ({ page }: HomepagePageProps) => {
    const section = page.sections.ourServices
    const services = useTemplateStyles().pages.home.services
    const sectionHeader = useTemplateStyles().pages.home.sectionHeader

    return (
        <section
            className={cn(services.section)}
            style={{ backgroundColor: section.backgroundColor }}
            aria-labelledby='our-services-heading'
        >
            <div className='agency-container'>
                <header className={cn(services.header)}>
                    <SectionEyebrow
                        name={section.eyebrow}
                        className={cn(
                            '[&>span:nth-child(2)]:text-sm [&>span:nth-child(2)]:leading-5 sm:[&>span:nth-child(2)]:text-[20px] sm:[&>span:nth-child(2)]:leading-6',
                            sectionHeader.eyebrow,
                        )}
                    />
                    <h2
                        id='our-services-heading'
                        className={cn(
                            sectionHeader.title,
                            'pt-2 text-[26px] font-medium leading-tight sm:pt-4 sm:text-[40px] sm:leading-[48px]',
                        )}
                        style={{ color: STATIC_UI_COLORS.title, fontFamily: 'var(--hp-font-heading)' }}
                    >
                        {section.title}
                    </h2>
                </header>

                <div className={cn(services.grid)}>
                    {section.items.map((service) => (
                        <ServiceCard key={service.title} {...service} />
                    ))}
                </div>

                <div className='flex justify-center pt-8 sm:pt-12 lg:pt-8'>
                    <PrefixedLink
                        href={section.cta.href ?? '/discover#services'}
                        className={cn(
                            'text-sm font-semibold underline underline-offset-4 sm:text-base flex items-center',
                            HP_THEME_LINK_CLASS,
                        )}
                    >
                        <div className='flex items-center justify-start gap-1.5'>
                            {section.cta.label}
                            <ArrowRightIcon className='size-4' />
                        </div>
                    </PrefixedLink>
                </div>
            </div>
        </section>
    )
}

export default OurServices
