'use client'

import { ServiceCard } from '@/components/pages/marketing/home/ServiceCard'
import { Button } from '@/components/ui/button'
import { PageHeroBanner, PAGE_HERO_CONTENT_CLASS } from '@/components/ui/page-hero-banner'
import type { HomepagePage } from '@/data/homepage'
import { HP_THEME_BG_CLASS, HP_THEME_BORDER_CLASS, HP_THEME_TEXT_CLASS, STATIC_UI_COLORS } from '@/data/homepage'
import { useHeroBackgroundImage } from '@/hooks/useHeroBackgroundImage'
import { useHomepagePageWithFallback } from '@/hooks/useHomepagePageWithFallback'
import { adaptTourCopyForUmrah, usesHajjUmrahBanner } from '@/lib/homepage/specialization'
import {
    selectHomepageIsLoading,
    selectHomepageSpecializationId,
    selectHomepageSpecializations,
} from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'
import { cn } from '@/lib/utils/clsxUtils'

type DiscoverPageProps = {
    page?: HomepagePage
}

export default function DiscoverPage({ page: pageFromServer }: DiscoverPageProps) {
    const pageFromStore = useHomepagePageWithFallback()
    const isLoading = useAppSelector(selectHomepageIsLoading)
    const specializationId = useAppSelector(selectHomepageSpecializationId)
    const specializations = useAppSelector(selectHomepageSpecializations)
    const page = pageFromServer ?? pageFromStore
    const backgroundImage = useHeroBackgroundImage()
    const isUmrahSite = usesHajjUmrahBanner(specializationId, specializations)

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

    const preFooterDescription = adaptTourCopyForUmrah(
        'Browse published tours or speak with our team for a tailored consultation.',
        isUmrahSite,
    )
    const browseLabel = isUmrahSite ? 'Browse Packages' : 'Browse Tours'

    return (
        <>
            <PageHeroBanner
                backgroundImage={backgroundImage}
                fixedHeight
                className='px-2 pt-2 sm:px-3 sm:pt-3 md:px-4 md:pt-4 lg:px-5 lg:pt-5 pb-0'
            >
                <div id='services' className={PAGE_HERO_CONTENT_CLASS}>
                    <h1 className='text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl xl:text-[45px]'>
                        {ourServices.title}
                    </h1>
                    <p className='mx-auto mt-4 max-w-[640px] text-sm leading-6 text-white/90 sm:text-base xl:text-lg'>
                        Explore the full range of travel services we offer — from curated expeditions and
                        custom itineraries to on-ground support across Pakistan.
                    </p>
                </div>
            </PageHeroBanner>

            <main className='pb-12 pt-8 sm:pb-20 sm:pt-12 lg:pt-16'>
                <div className='agency-container'>
                    <header className='mx-auto max-w-2xl text-center'>
                        <h2
                            className='agency-section-heading text-[32px] font-medium leading-tight sm:text-[40px] sm:leading-[48px]'
                            style={{ color: STATIC_UI_COLORS.title, fontFamily: 'var(--hp-font-heading)' }}
                        >
                            All services
                        </h2>
                    </header>

                    <div className='mx-auto mt-6 grid w-full max-w-[1312px] grid-cols-1 gap-3 sm:mt-8 sm:gap-5 md:grid-cols-2 lg:mt-10 lg:gap-6'>
                        {ourServices.items.map((service) => (
                            <ServiceCard key={service.title} {...service} />
                        ))}
                    </div>

                    <section className='mx-auto mt-10 w-full max-w-[1312px] sm:mt-12 lg:mt-16'>
                        <div
                            className={cn(
                                'border px-6 py-12 text-center text-white sm:px-10 sm:py-14 rounded-xl',
                                HP_THEME_BORDER_CLASS,
                                HP_THEME_BG_CLASS,
                            )}
                        >
                            <h2 className='text-2xl font-semibold sm:text-3xl'>
                                Ready to plan your journey?
                            </h2>
                            <p className='mx-auto mt-3 max-w-[560px] text-sm leading-6 text-white/85 sm:text-base'>
                                {preFooterDescription}
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
                                    {browseLabel}
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
