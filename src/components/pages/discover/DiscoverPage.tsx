'use client'

import { ServiceCard } from '@/components/pages/marketing/home/ServiceCard'
import { Button } from '@/components/ui/button'
import { PageHeroBanner, PAGE_HERO_CONTENT_CLASS } from '@/components/ui/page-hero-banner'
import type { HomepagePage } from '@/data/homepage'
import { HP_THEME_BG_CLASS, HP_THEME_BORDER_CLASS, HP_THEME_TEXT_CLASS, STATIC_UI_COLORS } from '@/data/homepage'
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
            <PageHeroBanner backgroundImage={backgroundImage} fixedHeight>
                    <div id='services' className={PAGE_HERO_CONTENT_CLASS}>
                        <h1
                            className='text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl xl:text-[45px]'
                        >
                            {ourServices.title}
                        </h1>
                        <p
                            className='mx-auto mt-4 max-w-[640px] text-sm leading-6 text-white/90 sm:text-base xl:text-lg'
                        >
                            Explore the full range of travel services we offer — from curated expeditions and
                            custom itineraries to on-ground support across Pakistan.
                        </p>
                    </div>
            </PageHeroBanner>

            <main
                className='pb-20 pt-16 sm:pt-20 lg:pt-[100px]'
                style={{ backgroundColor: ourServices.backgroundColor }}
            >
                <div className='agency-container'>
                    <div className='mx-auto w-full max-w-[820px] px-0'>
                    <header className='text-center'>
                        <h2
                            className='agency-section-heading pt-3 text-[32px] font-medium leading-tight sm:pt-4 sm:text-[40px] sm:leading-[48px]'
                            style={{ color: STATIC_UI_COLORS.title, fontFamily: 'var(--hp-font-heading)' }}
                        >
                            All services
                        </h2>
                    </header>

                    <div className='grid w-full grid-cols-1 gap-4 pt-10 sm:gap-5 sm:pt-12 md:grid-cols-2 md:pt-14 lg:gap-6 lg:pt-16'>
                        {ourServices.items.map((service) => (
                            <ServiceCard key={service.title} {...service} />
                        ))}
                    </div>

                    <section className='mt-14'>
                        <div
                            className={cn(
                                'border px-6 py-12 text-center text-white sm:px-10 sm:py-14',
                                HP_THEME_BORDER_CLASS,
                                HP_THEME_BG_CLASS,
                            )}
                        >
                            <h2 className='text-2xl font-semibold sm:text-3xl'>
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
                </div>
            </main>
        </>
    )
}
