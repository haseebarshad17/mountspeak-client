'use client'

import { Button } from '@/components/ui/button'
import {
    HP_THEME_BG_CLASS,
    HP_THEME_BORDER_CLASS,
    HP_THEME_TEXT_CLASS,
} from '@/data/homepage'
import { useHeroBackgroundImage } from '@/hooks/useHeroBackgroundImage'
import { cn } from '@/lib/utils/clsxUtils'
import { Compass, MapPin, ShieldCheck, Users } from 'lucide-react'
import {
    aboutHero,
    aboutMission,
    aboutStats,
    aboutStory,
    aboutValues,
} from './about-us-content'

const valueIcons = [Compass, ShieldCheck, MapPin, Users] as const

export default function AboutUsPage() {
    const backgroundImage = useHeroBackgroundImage()

    return (
        <>
            <section className='p-2 sm:p-3 md:p-4 lg:p-5'>
                <div
                    className='rounded-[16px] bg-cover bg-center bg-no-repeat'
                    style={{ backgroundImage: `url("${backgroundImage}")` }}
                >
                    <div className='px-4 pb-12 pt-[120px] text-center text-white sm:px-6 sm:pb-14 sm:pt-36 md:pb-16 md:pt-44 lg:pb-20 lg:pt-48'>
                        <p
                            className='text-xs font-semibold uppercase tracking-[0.6px] text-white/80'
                        >
                            {aboutHero.eyebrow}
                        </p>
                        <h1
                            className='mt-3 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl xl:text-[45px]'
                        >
                            {aboutHero.title}
                        </h1>
                        <p
                            className='mx-auto mt-4 max-w-[640px] text-sm leading-7 text-white/90 sm:text-base xl:text-lg'
                        >
                            {aboutHero.description}
                        </p>
                    </div>
                </div>
            </section>

            <main className='bg-[#F7F8FA] pb-20 pt-4 sm:pt-6'>
                <div className='agency-container space-y-16 sm:space-y-20'>
                    <section className='mx-auto max-w-[820px] px-[15px] text-center'>
                        <h2
                            className='text-[32px] font-medium leading-tight text-[#14141F] sm:text-[40px]'
                        >
                            {aboutMission.title}
                        </h2>
                        <div className='mt-6 space-y-4 text-left sm:text-center'>
                            {aboutMission.paragraphs.map((paragraph) => (
                                <p
                                    key={paragraph}
                                    className='text-base leading-7 text-neutral-600'
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </section>

                    <section className='mx-auto max-w-[1182px] px-[15px]'>
                        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                            {aboutStats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className='border border-[#C0C8C9] bg-white px-6 py-8 text-center'
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

                    <section className='mx-auto max-w-[1182px] px-[15px]'>
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
                                        className='border border-[#C0C8C9] bg-white p-6 sm:p-8'
                                    >
                                        <div className={cn('flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF1F3]', HP_THEME_TEXT_CLASS)}>
                                            <Icon className='h-5 w-5' aria-hidden />
                                        </div>
                                        <h3
                                            className={cn('mt-5 text-xl font-semibold', HP_THEME_TEXT_CLASS)}
                                        >
                                            {value.title}
                                        </h3>
                                        <p
                                            className='mt-3 text-sm leading-7 text-neutral-600 sm:text-base'
                                        >
                                            {value.description}
                                        </p>
                                    </article>
                                )
                            })}
                        </div>
                    </section>

                    <section className='mx-auto max-w-[820px] border border-[#C0C8C9] bg-white px-6 py-10 sm:px-10 sm:py-12'>
                        <h2
                            className='text-center text-[32px] font-medium leading-tight text-[#14141F] sm:text-[40px]'
                        >
                            {aboutStory.title}
                        </h2>
                        <div className='mt-6 space-y-4'>
                            {aboutStory.paragraphs.map((paragraph) => (
                                <p
                                    key={paragraph}
                                    className='text-base leading-7 text-neutral-600'
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </section>

                    <section className='mx-auto max-w-[1182px] px-[15px]'>
                        <div className={cn('border px-6 py-12 text-center text-white sm:px-10 sm:py-14', HP_THEME_BORDER_CLASS, HP_THEME_BG_CLASS)}>
                            <h2
                                className='text-2xl font-semibold sm:text-3xl'
                            >
                                Ready to plan your journey?
                            </h2>
                            <p
                                className='mx-auto mt-3 max-w-[560px] text-sm leading-7 text-white/85 sm:text-base'
                            >
                                Browse published tours or speak with our team for a tailored consultation.
                            </p>
                            <div className='mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row'>
                                <Button
                                    href='/search'
                                    className={cn('min-w-[200px] bg-white hover:bg-white/90', HP_THEME_TEXT_CLASS)}
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
