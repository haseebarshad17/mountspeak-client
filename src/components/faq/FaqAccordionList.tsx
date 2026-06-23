'use client'

import { HP_CSS_VARS, STATIC_UI_COLORS } from '@/data/homepage'
import { cn } from '@/lib/utils/clsxUtils'
import type { FaqRow } from '@/services/faqs/faqs.types'
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

type FaqAccordionListProps = {
    faqs: FaqRow[]
    className?: string
}

export function FaqAccordionList({ faqs, className }: FaqAccordionListProps) {
    const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null)

    return (
        <div className={cn('rounded-2xl bg-white px-5 shadow-sm sm:px-8', className)}>
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
    )
}
