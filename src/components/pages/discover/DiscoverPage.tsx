'use client'

import { ServiceCard } from '@/components/pages/marketing/home/ServiceCard'
import { Button } from '@/components/ui/button'
import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import type { HomepagePage } from '@/data/homepage'
import { HP_CSS_VARS, HP_OUTLINE_BTN_STYLE, HP_THEME_BTN_CLASS, HP_THEME_BTN_STYLE, HP_THEME_OUTLINE_BTN_CLASS, STATIC_UI_COLORS } from '@/data/homepage'
import { useHeroBackgroundImage } from '@/hooks/useHeroBackgroundImage'
import { useHomepagePageWithFallback } from '@/hooks/useHomepagePageWithFallback'
import { selectHomepageIsLoading } from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'
import { cn } from '@/lib/utils/clsxUtils'

type DiscoverPageProps = {
    page?: HomepagePage
}

export default function DiscoverPage({ page: pageFromServer }: DiscoverPageProps) {
    const pageFromStore = useHomepagePageWithFallback()
    const isLoading = useAppSelector(selectHomepageIsLoading)
    const page = pageFromServer ?? pageFromStore
    const backgroundImage = useHeroBackgroundImage()

    if (isLoading || !page) {
        return (
            <div className='flex min-h-[50vh] items-center justify-center px-4'>
                <p className='text-sm text-neutral-500'>Loading services…</p>
            </div>
        )
    }

    const ourServices = page.sections.ourServices

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
                <div
                    className='rounded-[16px] bg-cover bg-center bg-no-repeat'
                    style={{ backgroundImage: `url("${backgroundImage}")` }}
                >
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
                        <SectionEyebrow name={ourServices.eyebrow} />
                        <h2
                            className='agency-section-heading pt-3 text-[32px] font-medium leading-tight sm:pt-4 sm:text-[40px] sm:leading-[48px]'
                            style={{ color: STATIC_UI_COLORS.title, fontFamily: 'var(--hp-font-heading)' }}
                        >
                            All services
                        </h2>
                    </header>

                    <div className='mx-auto grid w-full max-w-[1312px] grid-cols-1 gap-4 pt-10 sm:gap-5 sm:pt-12 md:grid-cols-2 md:pt-14 lg:gap-6 lg:pt-16'>
                        {ourServices.items.map((service) => (
                            <ServiceCard key={service.title} {...service} />
                        ))}
                    </div>

                    <div
                        className='mx-auto mt-14 flex max-w-[1312px] flex-col items-center justify-between gap-6 border-t pt-10 sm:flex-row sm:pt-12'
                        style={{ borderColor: HP_CSS_VARS.primaryBorder }}
                    >
                        <p
                            className='max-w-xl text-center text-base leading-7 sm:text-left'
                            style={{ color: STATIC_UI_COLORS.textMuted, fontFamily: 'var(--hp-font-body)' }}
                        >
                            Ready to plan your trip? Browse published tours or speak with our team for a tailored
                            consultation.
                        </p>
                        <div className='flex flex-col gap-3 sm:flex-row'>
                            <Button
                                variant='default'
                                style={HP_THEME_BTN_STYLE}
                                className={cn('min-w-[180px]', HP_THEME_BTN_CLASS)}
                                href='/search'
                            >
                                Browse Tours
                            </Button>
                            <Button
                                variant='outline'
                                style={HP_OUTLINE_BTN_STYLE}
                                className={cn('min-w-[180px]', HP_THEME_OUTLINE_BTN_CLASS)}
                                href='/contact-us'
                            >
                                Contact Us
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
