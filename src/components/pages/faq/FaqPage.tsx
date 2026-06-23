'use client'

import { FaqAccordionList } from '@/components/faq/FaqAccordionList'
import { SectionEmptyState } from '@/components/ui/section-empty-state'
import { PageHeroBanner, PAGE_HERO_CONTENT_CLASS } from '@/components/ui/page-hero-banner'
import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import { STATIC_UI_COLORS } from '@/data/homepage'
import { useHeroBackgroundImage } from '@/hooks/useHeroBackgroundImage'
import { useIsAgencySite } from '@/hooks/useIsAgencySite'
import { useTravelerFaqs } from '@/services/faqs/faqs.queries'
import { selectHomepageAgencyId } from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'
import { HelpCircle } from 'lucide-react'

export default function FaqPage() {
    const backgroundImage = useHeroBackgroundImage()
    const isAgencySite = useIsAgencySite()
    const agencyId = useAppSelector(selectHomepageAgencyId)
    const { data: faqs = [], isLoading } = useTravelerFaqs(agencyId, isAgencySite === true)

    return (
        <>
            <PageHeroBanner backgroundImage={backgroundImage} fixedHeight>
                    <div className={PAGE_HERO_CONTENT_CLASS}>
                        <p className='text-xs font-semibold uppercase tracking-[0.6px] text-white/80'>
                            FAQ
                        </p>
                        <h1 className='mt-3 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl xl:text-[45px]'>
                            Frequently Asked Questions
                        </h1>
                        <p className='mx-auto mt-4 max-w-[640px] text-sm leading-7 text-white/90 sm:text-base xl:text-lg'>
                            Quick answers to common questions about planning your trip with us.
                        </p>
                    </div>
            </PageHeroBanner>

            <main className='bg-[#F7F8FA] pb-20 pt-16 sm:pt-20 lg:pt-[80px]'>
                <div className='agency-container'>
                    <div className='mx-auto max-w-3xl px-[15px]'>
                        <header className='text-center'>
                            <SectionEyebrow name='Help Center' />
                            <h2
                                className='agency-section-heading pt-3 text-[32px] font-medium leading-tight sm:pt-4 sm:text-[40px] sm:leading-[48px]'
                                style={{ color: STATIC_UI_COLORS.title, fontFamily: 'var(--hp-font-heading)' }}
                            >
                                Traveler FAQs
                            </h2>
                            <p
                                className='mx-auto mt-4 max-w-2xl text-sm font-normal leading-7 sm:text-base'
                                style={{ color: STATIC_UI_COLORS.textMuted, fontFamily: 'var(--hp-font-body)' }}
                            >
                                Browse answers about bookings, packages, payments, and trip planning.
                            </p>
                        </header>

                        <div className='mt-8 sm:mt-10 lg:mt-12'>
                            {isLoading ? (
                                <div
                                    className='rounded-2xl bg-white px-5 py-12 text-center shadow-sm sm:px-8'
                                    aria-busy='true'
                                >
                                    <p
                                        className='text-base'
                                        style={{ color: STATIC_UI_COLORS.textMuted, fontFamily: 'var(--hp-font-body)' }}
                                    >
                                        Loading FAQs…
                                    </p>
                                </div>
                            ) : faqs.length > 0 ? (
                                <FaqAccordionList faqs={faqs} />
                            ) : (
                                <SectionEmptyState
                                    icon={HelpCircle}
                                    title='No FAQs yet'
                                    description='Frequently asked questions will appear here once they are published for your agency.'
                                />
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
