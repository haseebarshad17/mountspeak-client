'use client'

import { FaqAccordionList } from '@/components/faq/FaqAccordionList'
import { FaqAccordionSkeleton } from '@/components/faq/FaqAccordionSkeleton'
import { SectionEmptyState } from '@/components/ui/section-empty-state'
import { PageHeroBanner, PAGE_HERO_CONTENT_CLASS } from '@/components/ui/page-hero-banner'
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
                    <h1 className='text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl xl:text-[45px]'>
                        Frequently Asked Questions
                    </h1>
                    <p className='mx-auto mt-4 max-w-[640px] text-sm leading-6 text-white/90 sm:text-base xl:text-lg'>
                        Quick answers to common questions about planning your trip with us.
                    </p>
                </div>
            </PageHeroBanner>

            <main className='bg-[#F7F8FA] pb-12 pt-10 sm:pb-20 sm:pt-16 lg:pt-20'>
                <div className='agency-container'>
                    <div className='mx-auto max-w-3xl'>
                        <header className='text-center'>
                            <h2
                                className='agency-section-heading text-[#14141F]'
                                style={{ fontFamily: 'var(--hp-font-heading)' }}
                            >
                                Traveler FAQs
                            </h2>
                            <p
                                className='mx-auto mt-3 max-w-2xl text-sm font-normal leading-6 sm:mt-4 sm:text-base'
                                style={{ color: STATIC_UI_COLORS.textMuted, fontFamily: 'var(--hp-font-body)' }}
                            >
                                Browse answers about bookings, packages, payments, and trip planning.
                            </p>
                        </header>

                        <div className='mt-6 sm:mt-8 lg:mt-10'>
                            {isLoading ? (
                                <FaqAccordionSkeleton />
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
