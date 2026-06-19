'use client'

import { HP_THEME_BTN_CLASS, HP_THEME_BTN_STYLE, STATIC_UI_COLORS } from '@/data/homepage'

import { Button } from '@/components/ui/button'
import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import { cn } from '@/lib/utils/clsxUtils'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import React from 'react'
import { ServiceCard } from './ServiceCard'

const OurServices = ({ page }: HomepagePageProps) => {
    const section = page.sections.ourServices

    return (
        <section
            className='py-14 sm:py-[100px]'
            style={{ backgroundColor: section.backgroundColor }}
            aria-labelledby='our-services-heading'
        >
            <div className='agency-container'>
                <header className='mx-auto max-w-2xl text-center'>
                    <SectionEyebrow
                        name={section.eyebrow}
                        className='[&>span:nth-child(2)]:text-sm [&>span:nth-child(2)]:leading-5 sm:[&>span:nth-child(2)]:text-[20px] sm:[&>span:nth-child(2)]:leading-6'
                    />
                    <h2
                        id='our-services-heading'
                        className='agency-section-heading pt-2 text-[26px] font-medium leading-tight sm:pt-4 sm:text-[40px] sm:leading-[48px]'
                        style={{ color: STATIC_UI_COLORS.title, fontFamily: 'var(--hp-font-heading)' }}
                    >
                        {section.title}
                    </h2>
                </header>

                <div className='mx-auto grid w-full max-w-[1312px] grid-cols-1 gap-3 pt-6 sm:gap-5 sm:pt-8 md:grid-cols-2 md:pt-10 lg:gap-6 lg:pt-12'>
                    {section.items.map((service) => (
                        <ServiceCard key={service.title} {...service} />
                    ))}
                </div>

                <div className='flex justify-center pt-8 sm:pt-12 lg:pt-8'>
                    <Button
                        variant='default'
                        style={HP_THEME_BTN_STYLE}
                        className={cn('w-[219px] max-w-[219px]', HP_THEME_BTN_CLASS)}
                        href={section.cta.href ?? '/discover#services'}
                    >
                        {section.cta.label}
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default OurServices
