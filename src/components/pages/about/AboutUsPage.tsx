'use client'

import { Button } from '@/components/ui/button'
import { PageHeroBanner, PAGE_HERO_CONTENT_CLASS } from '@/components/ui/page-hero-banner'
import {
    HP_THEME_BG_CLASS,
    HP_THEME_TEXT_CLASS,
} from '@/data/homepage'
import { useHeroBackgroundImage } from '@/hooks/useHeroBackgroundImage'
import { cn } from '@/lib/utils/clsxUtils'
import { Compass, MapPin, ShieldCheck, Users } from 'lucide-react'
import type { CSSProperties } from 'react'
import {
    aboutHero,
    aboutMission,
    aboutStats,
    aboutStory,
    aboutValues,
} from './about-us-content'

const valueIcons = [Compass, ShieldCheck, MapPin, Users] as const

const aboutCardClassName = 'rounded-xl border bg-white'

const aboutThemeBorderStyle: CSSProperties = {
    borderColor: 'color-mix(in srgb, var(--hp-color-primary) 35%, white)',
}

export default function AboutUsPage() {
    const backgroundImage = useHeroBackgroundImage()

    return (
        <>
            <PageHeroBanner backgroundImage={backgroundImage} fixedHeight>
                    <div className={PAGE_HERO_CONTENT_CLASS}>
                        <h1
                            className='text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl xl:text-[45px]'
                        >
                            {aboutHero.title}
                        </h1>
                        <p
                            className='mx-auto mt-4 max-w-[640px] text-sm leading-6 text-white/90 sm:text-base xl:text-lg'
                        >
                            {aboutHero.description}
                        </p>
                    </div>
            </PageHeroBanner>

            <main className='pb-20 pt-16 sm:pt-20 lg:pt-[100px]'>
                <div className='agency-container space-y-16 sm:space-y-20'>
                    <section className='mx-auto max-w-[820px] px-0 text-center'>
                        <h2
                            className='text-[32px] font-medium leading-tight text-[#14141F] sm:text-[40px]'
                        >
                            {aboutMission.title}
                        </h2>
                        <div className='mt-6 space-y-4 text-left sm:text-center'>
                            {aboutMission.paragraphs.map((paragraph) => (
                                <p
                                    key={paragraph}
                                    className='text-base leading-6 text-neutral-600'
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </section>

                    <section className='mx-auto max-w-[820px] px-0'>
                        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                            {aboutStats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className={cn(aboutCardClassName, 'px-6 py-8 text-center')}
                                    style={aboutThemeBorderStyle}
                                >
                                    <p
                                        className={cn('text-3xl font-semibold sm:text-4xl', HP_THEME_TEXT_CLASS)}
                                    >
                                        {stat.value}
                                    </p>
                                    <p
                                        className='mt-2 text-sm text-neutral-600'
                                    >
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className='mx-auto max-w-[820px] px-0'>
                        <div className='mx-auto max-w-[700px] text-center'>
                            <h2
                                className='text-[32px] font-medium leading-tight text-[#14141F] sm:text-[40px]'
                            >
                                What we stand for
                            </h2>
                        </div>
                        <div className='mt-10 grid gap-6 sm:grid-cols-2'>
                            {aboutValues.map((value, index) => {
                                const Icon = valueIcons[index] ?? Compass
                                return (
                                    <article
                                        key={value.title}
                                        className={cn(aboutCardClassName, 'p-6 sm:p-8')}
                                        style={aboutThemeBorderStyle}
                                    >
                                        <div className='flex items-center gap-3'>
                                            <Icon
                                                className={cn('h-7 w-7 shrink-0 stroke-[1.75]', HP_THEME_TEXT_CLASS)}
                                                aria-hidden
                                            />
                                            <h3
                                                className={cn('text-lg font-semibold leading-snug sm:text-xl', HP_THEME_TEXT_CLASS)}
                                            >
                                                {value.title}
                                            </h3>
                                        </div>
                                        <p
                                            className='mt-4 text-sm leading-6 text-neutral-600 sm:text-base'
                                        >
                                            {value.description}
                                        </p>
                                    </article>
                                )
                            })}
                        </div>
                    </section>

                    <section className='mx-auto max-w-[820px] px-0'>
                        <div
                            className={cn(aboutCardClassName, 'px-6 py-10 sm:px-10 sm:py-12')}
                            style={aboutThemeBorderStyle}
                        >
                        <h2
                            className='text-center text-[32px] font-medium leading-tight text-[#14141F] sm:text-[40px]'
                        >
                            {aboutStory.title}
                        </h2>
                        <div className='mt-6 space-y-4'>
                            {aboutStory.paragraphs.map((paragraph) => (
                                <p
                                    key={paragraph}
                                    className='text-base leading-6 text-neutral-600'
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                        </div>
                    </section>

                    <section className='mx-auto max-w-[820px] px-0'>
                        <div
                            className={cn('rounded-xl border px-6 py-12 text-center text-white sm:px-10 sm:py-14', HP_THEME_BG_CLASS)}
                            style={aboutThemeBorderStyle}
                        >
                            <h2
                                className='text-2xl font-semibold sm:text-3xl'
                            >
                                Ready to plan your journey?
                            </h2>
                            <p
                                className='mx-auto mt-3 max-w-[560px] text-sm leading-6 text-white/85 sm:text-base'
                            >
                                Browse published tours or speak with our team for a tailored consultation.
                            </p>
                            <div className='mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row'>
                                <Button
                                    href='/search'
                                    variant='hero-outline'
                                    className={cn(
                                        'min-w-[200px] !border-white !bg-white hover:!border-white hover:!bg-white/90',
                                        HP_THEME_TEXT_CLASS,
                                    )}
                                >
                                    Browse Tours
                                </Button>
                                <Button
                                    href='/contact-us'
                                    variant='outline-on-dark'
                                    className='min-w-[200px] border-white/40 hover:bg-white/10'
                                >
                                    Contact Us
                                </Button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </>
    )
}
