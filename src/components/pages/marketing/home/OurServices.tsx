'use client'

import { Button } from '@/components/ui/button'
import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import Link from 'next/link'
import React from 'react'
import { ServiceCard } from './ServiceCard'

const OurServices = ({ page }: HomepagePageProps) => {
    const section = page.sections.ourServices
    const { colors, buttons } = page.theme

    return (
        <section
            className='py-16 sm:py-20 lg:py-[96px]'
            style={{ backgroundColor: section.backgroundColor }}
            aria-labelledby='our-services-heading'
        >
            <div className='agency-container'>
                <header className='mx-auto max-w-2xl text-center'>
                    <SectionEyebrow name={section.eyebrow} color={colors.eyebrow} />
                    <h2
                        id='our-services-heading'
                        className='agency-section-heading pt-3 text-[40px] font-medium leading-[48px] sm:pt-4'
                        style={{ color: colors.title, fontFamily: 'var(--hp-font-heading)' }}
                    >
                        {section.title}
                    </h2>
                </header>

                <div className='mx-auto grid w-full max-w-[1312px] grid-cols-1 gap-4 pt-8 sm:gap-5 sm:pt-8 md:grid-cols-2 md:pt-10 lg:gap-6 lg:pt-12'>
                    {section.items.map((service) => (
                        <ServiceCard key={service.title} {...service} colors={colors} />
                    ))}
                </div>

                <div className='flex justify-center pt-10 sm:pt-12 lg:pt-8'>
                    <Button
                        variant='default'
                        className='h-[58px] w-[219px] max-w-[219px] rounded-full border px-8 text-sm font-medium sm:w-[219px] sm:text-base'
                        style={{
                            backgroundColor: buttons.primary.background,
                            borderColor: buttons.primary.border,
                            color: buttons.primary.text,
                        }}
                        asChild
                    >
                        <Link href={section.cta.href ?? '/discover#services'}>{section.cta.label}</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default OurServices
