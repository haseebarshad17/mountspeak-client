'use client'

import { ServiceCard } from '@/components/pages/marketing/home/ServiceCard'
import { Button } from '@/components/ui/button'
import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import type { HomepagePage } from '@/data/homepage'
import { useHomepagePageWithFallback } from '@/hooks/useHomepagePageWithFallback'
import { selectHomepageIsLoading } from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'
import Link from 'next/link'

type DiscoverPageProps = {
    page?: HomepagePage
}

export default function DiscoverPage({ page: pageFromServer }: DiscoverPageProps) {
    const pageFromStore = useHomepagePageWithFallback()
    const isLoading = useAppSelector(selectHomepageIsLoading)
    const page = pageFromServer ?? pageFromStore

    if (isLoading || !page) {
        return (
            <div className='flex min-h-[50vh] items-center justify-center px-4'>
                <p className='text-sm text-neutral-500'>Loading services…</p>
            </div>
        )
    }

    const ourServices = page.sections.ourServices
    const { colors, buttons } = page.theme

    if (!ourServices?.items?.length) {
        return (
            <div className='flex min-h-[50vh] items-center justify-center px-4'>
                <p className='text-sm text-neutral-500'>No services are published yet.</p>
            </div>
        )
    }

    return (
        <>
            <section className='p-2 sm:p-3 md:p-4 lg:p-5'>
                <div className='rounded-[16px] bg-[url("/images/pages/home/tour-list.png")] bg-cover bg-center bg-no-repeat'>
                    <div
                        id='services'
                        className='px-4 pb-12 pt-[120px] text-center text-white sm:px-6 sm:pb-14 sm:pt-36 md:pb-16 md:pt-44 lg:pb-20 lg:pt-48'
                    >
                        <p
                            className='text-xs font-semibold uppercase tracking-[0.6px] text-white/80'
                        >
                            {ourServices.eyebrow}
                        </p>
                        <h1
                            className='mt-3 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl xl:text-[45px]'
                        >
                            {ourServices.title}
                        </h1>
                        <p
                            className='mx-auto mt-4 max-w-[640px] text-sm leading-7 text-white/90 sm:text-base xl:text-lg'
                        >
                            Explore the full range of travel services we offer — from curated expeditions and
                            custom itineraries to on-ground support across Pakistan.
                        </p>
                    </div>
                </div>
            </section>

            <main
                className='pb-20 pt-16 sm:pt-20 lg:pt-[100px]'
                style={{ backgroundColor: ourServices.backgroundColor }}
            >
                <div className='agency-container'>
                    <header className='mx-auto max-w-3xl text-center'>
                        <SectionEyebrow name={ourServices.eyebrow} color={colors.eyebrow} />
                        <h2
                            className='agency-section-heading pt-3 text-[32px] font-medium leading-tight sm:pt-4 sm:text-[40px] sm:leading-[48px]'
                            style={{ color: colors.title, fontFamily: 'var(--hp-font-heading)' }}
                        >
                            All services
                        </h2>
                    </header>

                    <div className='mx-auto grid w-full max-w-[1312px] grid-cols-1 gap-4 pt-10 sm:gap-5 sm:pt-12 md:grid-cols-2 md:pt-14 lg:gap-6 lg:pt-16'>
                        {ourServices.items.map((service) => (
                            <ServiceCard key={service.title} {...service} colors={colors} />
                        ))}
                    </div>

                    <div
                        className='mx-auto mt-14 flex max-w-[1312px] flex-col items-center justify-between gap-6 border-t pt-10 sm:flex-row sm:pt-12'
                        style={{ borderColor: colors.border }}
                    >
                        <p
                            className='max-w-xl text-center text-base leading-7 sm:text-left'
                            style={{ color: colors.textMuted, fontFamily: 'var(--hp-font-body)' }}
                        >
                            Ready to plan your trip? Browse published tours or speak with our team for a tailored
                            consultation.
                        </p>
                        <div className='flex flex-col gap-3 sm:flex-row'>
                            <Button
                                variant='default'
                                className='min-w-[180px]'
                                style={{
                                    backgroundColor: buttons.primary.background,
                                    borderColor: buttons.primary.border,
                                    color: buttons.primary.text,
                                }}
                                asChild
                            >
                                <Link href='/search'>Browse Tours</Link>
                            </Button>
                            <Button
                                variant='outline'
                                className='min-w-[180px]'
                                style={{
                                    borderColor: colors.border,
                                    color: colors.primaryDark,
                                }}
                                asChild
                            >
                                <Link href='/contact-us'>Contact Us</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
