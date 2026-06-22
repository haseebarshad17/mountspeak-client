'use client'

import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import { HP_CSS_VARS, STATIC_UI_COLORS } from '@/data/homepage'
import { useIsAgencySite } from '@/hooks/useIsAgencySite'
import { cn } from '@/lib/utils/clsxUtils'
import { useTravelerFaqs } from '@/services/faqs/faqs.queries'
import type { FaqRow } from '@/services/faqs/faqs.types'
import { selectHomepageAgencyId } from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'
import { ChevronDown } from 'lucide-react'
import { useId, useState } from 'react'

function FaqItem({
    faq,
    isOpen,
    onToggle,
}: {
    faq: FaqRow
    isOpen: boolean
    onToggle: () => void
}) {
    const answerId = useId()

    return (
        <div
            className='border-b last:border-b-0'
            style={{ borderColor: STATIC_UI_COLORS.borderLight }}
        >
            <button
                type='button'
                className='flex w-full items-start justify-between gap-4 py-5 text-left sm:py-6'
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={onToggle}
            >
                <span
                    className='text-readable text-base font-medium leading-7 sm:text-lg'
                    style={{
                        color: isOpen ? HP_CSS_VARS.primary : STATIC_UI_COLORS.title,
                        fontFamily: 'var(--hp-font-heading)',
                    }}
                >
                    {faq.question}
                </span>
                <ChevronDown
                    className={cn(
                        'mt-1 h-5 w-5 flex-shrink-0 transition-transform duration-300',
                        isOpen && 'rotate-180',
                    )}
                    style={{ color: HP_CSS_VARS.primary }}
                    aria-hidden
                />
            </button>

            <div
                id={answerId}
                className={cn(
                    'grid transition-[grid-template-rows] duration-300 ease-in-out',
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                )}
            >
                <div className='overflow-hidden'>
                    <p
                        className='text-readable pb-5 text-sm font-normal leading-7 sm:pb-6 sm:text-base'
                        style={{ color: STATIC_UI_COLORS.textBody, fontFamily: 'var(--hp-font-body)' }}
                    >
                        {faq.answer}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function MarketingFaqSection() {
    const isAgencySite = useIsAgencySite()
    const agencyId = useAppSelector(selectHomepageAgencyId)
    const { data: faqs = [], isLoading } = useTravelerFaqs(agencyId, isAgencySite === true)
    const [openId, setOpenId] = useState<string | null>(null)

    if (isAgencySite !== true || isLoading || faqs.length === 0) {
        return null
    }

    return (
        <section
            className='bg-white'
            style={{ backgroundColor: STATIC_UI_COLORS.backgroundMuted }}
            aria-labelledby='marketing-faq-heading'
        >
            <div className='agency-container py-[60px] sm:py-[80px] lg:py-[100px]'>
                <header className='mx-auto max-w-3xl text-center'>
                    <SectionEyebrow name='FAQ' />
                    <h2
                        id='marketing-faq-heading'
                        className='agency-section-heading pt-3 text-[32px] font-medium leading-tight sm:pt-4 sm:text-[40px] sm:leading-[48px]'
                        style={{ color: STATIC_UI_COLORS.title, fontFamily: 'var(--hp-font-heading)' }}
                    >
                        Frequently Asked Questions
                    </h2>
                    <p
                        className='mx-auto mt-4 max-w-2xl text-sm font-normal leading-7 sm:text-base'
                        style={{ color: STATIC_UI_COLORS.textMuted, fontFamily: 'var(--hp-font-body)' }}
                    >
                        Quick answers to common questions about planning your trip with us.
                    </p>
                </header>

                <div className='mx-auto mt-8 max-w-3xl rounded-2xl bg-white px-5 shadow-sm sm:mt-10 sm:px-8 lg:mt-12'>
                    {faqs.map((faq) => (
                        <FaqItem
                            key={faq.id}
                            faq={faq}
                            isOpen={openId === faq.id}
                            onToggle={() =>
                                setOpenId((current) => (current === faq.id ? null : faq.id))
                            }
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
