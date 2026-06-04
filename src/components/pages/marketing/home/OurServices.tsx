'use client'

import { Button } from '@/components/ui/button'
import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import type { HomepagePage } from '@/data/homepage'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type ServiceItem = HomepagePage['sections']['ourServices']['items'][number]

function ServiceCard({
    title,
    description,
    iconSrc,
    iconAlt,
    iconPosition,
    colors,
}: ServiceItem & { colors: HomepagePage['theme']['colors'] }) {
    const iconBlock = (
        <div className='relative h-16 w-16 shrink-0'>
            <Image
                src={iconSrc}
                alt={iconAlt}
                width={64}
                height={64}
                className='h-16 w-16 object-contain'
            />
        </div>
    )

    const textAlign = iconPosition === 'end' ? 'text-right' : 'text-left'

    const textBlock = (
        <div className={`min-w-0 flex-1 ${textAlign}`}>
            <h3
                className='font-jost text-[20px] font-medium leading-6 tracking-normal pb-[26px]'
                style={{ color: colors.title, fontFamily: 'var(--hp-font-heading)' }}
            >
                {title}
            </h3>
            <p
                className='pt-1 font-roboto text-base font-normal leading-6 tracking-normal'
                style={{ color: colors.text, fontFamily: 'var(--hp-font-body)' }}
            >
                {description}
            </p>
        </div>
    )

    return (
        <article
            className='mx-auto flex w-full max-w-[636px] min-h-[162px] items-center rounded-[10px] border bg-white px-[24px] py-4 shadow-sm'
            style={{ borderColor: colors.border }}
        >
            <div className='flex w-full items-center gap-6'>
                {iconPosition === 'start' && iconBlock}
                {textBlock}
                {iconPosition === 'end' && iconBlock}
            </div>
        </article>
    )
}

const OurServices = ({ page }: HomepagePageProps) => {
    const section = page.sections.ourServices
    const { colors, buttons } = page.theme

    return (
        <section
            className='py-16 sm:py-20 lg:py-[96px] mb-[342px]'
            style={{ backgroundColor: section.backgroundColor }}
            aria-labelledby='our-services-heading'
        >
            <div className='agency-container'>
                <header className='mx-auto max-w-2xl text-center'>
                    <SectionEyebrow name={section.eyebrow} color={colors.eyebrow} />
                    <h2
                        id='our-services-heading'
                        className='agency-section-heading text-[40px] leading-[48px] font-medium pt-3 sm:pt-4'
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
                        <Link href={section.cta.href ?? '/discover'}>{section.cta.label}</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default OurServices
