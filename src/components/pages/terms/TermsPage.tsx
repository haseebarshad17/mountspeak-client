'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/clsxUtils'
import { termsSections, type TermsSection } from './terms-content'

const SECTION_ITEM_ICONS = [
    '/images/pages/terms/term3.svg',
    '/images/pages/terms/term1.svg',
    '/images/pages/terms/term2.svg',
]

function SectionContent({ section }: { section: TermsSection }) {
    const sectionTopSpacing: Record<string, string> = {
        'user-responsibilities': 'mt-[88px]',
        'payment-terms': 'mt-[76px]',
        'data-protection': 'mt-[76px]',
        'cookie-policy': 'mt-[74px]',
        'liability-law': 'mt-[76.5px]',
    }
    const renderParagraphsAfterList = Boolean(section.list && section.paragraphs?.length)
    const isDataProtectionSection = section.id === 'data-protection'
    const isCookiePolicySection = section.id === 'cookie-policy'

    return (
        <div id={section.id} className={cn('scroll-mt-8', sectionTopSpacing[section.id])}>
            <span className='justify-center rounded-[12px] border border-neutral-300 bg-[#0640451A] max-w-[110px] min-h-[24px] w-full text-center flex items-center font-roboto text-xs text-[#7BABB1]'>
                {section.badge}
            </span>

            <h2 className='mt-3 font-heading text-[28px] font-semibold leading-tight text-neutral-900 sm:text-[34px] lg:text-[48px] lg:leading-[56px]'>
                {section.heading}
            </h2>

            {section.paragraphs && !renderParagraphsAfterList && !isDataProtectionSection && !isCookiePolicySection && (
                <div className='mt-6 space-y-4'>
                    {section.paragraphs.map((p, i) => (
                        <p
                            key={i}
                            className='text-base leading-normal text-neutral-600 sm:text-lg'
                        >
                            {p}
                        </p>
                    ))}
                </div>
            )}

            {section.cookieTable && (
                <div className='mt-6 max-w-[832px] overflow-x-auto'>
                    <div className='min-w-[760px] overflow-hidden rounded-[4px] border border-[#C0C8C9] bg-[#F7F8FA]'>
                        <div className='grid grid-cols-[1fr_3fr_1fr] border-b border-[#C0C8C9] bg-[#EAECEE] px-4 py-4 md:pl-4 md:pr-10'>
                            <p
                                className='text-xs font-medium font-roboto uppercase tracking-[0.6px] text-[var(--hp-color-primary)]'
                            >
                                Cookie Type
                            </p>
                            <p
                                className='text-xs font-medium font-roboto uppercase tracking-[0.6px] text-[var(--hp-color-primary)]'
                            >
                                Purpose
                            </p>
                            <p
                                className='text-right text-xs font-medium font-roboto uppercase tracking-[0.6px] text-[var(--hp-color-primary)]'
                            >
                                Duration
                            </p>
                        </div>

                        {section.cookieTable.map((row) => (
                            <div
                                key={row.type}
                                className='grid grid-cols-[1fr_3fr_1fr] border-b border-[#C0C8C9] px-4 py-4 last:border-b-0 md:pl-4 md:pr-10'
                            >
                                <p
                                    className='text-base font-medium leading-7 text-[var(--hp-color-primary)]'
                                >
                                    {row.type}
                                </p>
                                <p
                                    className='text-base text-[#404849]'
                                >
                                    {row.purpose}
                                </p>
                                <p
                                    className='text-base text-[#404849] text-right'
                                >
                                    {row.duration}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {section.paragraphs && isDataProtectionSection && (
                <div className='mt-6 max-w-[832px]'>
                    <p
                        className='text-base leading-normal text-neutral-600 sm:text-lg'
                    >
                        {section.paragraphs[0]}
                    </p>

                    <div className='mt-4 space-y-2 pl-4'>
                        {section.paragraphs.slice(1).map((p, i) => (
                            <p
                                key={i}
                                className='text-base leading-normal text-neutral-600 sm:text-lg'
                            >
                                {p}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            {section.items && (
                <div className='mt-6 max-w-[832px] space-y-5 border border-[#C0C8C9] bg-white p-8'>
                    {section.items.map((item, index) => (
                        <div key={item.title} className='flex items-start gap-4'>
                            <span className='mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#064045]'>
                                <Image
                                    src={SECTION_ITEM_ICONS[index] ?? '/images/pages/terms/term1.svg'}
                                    alt={`${item.title} icon`}
                                    width={18}
                                    height={20}
                                />
                            </span>
                            <div>
                                <p className='font-semibold text-[var(--hp-color-primary)] text-[20px] leading-6 max-w-[710px]'>{item.title}</p>
                                <p className='mt-2 text-base  text-[#404849]'>
                                    {item.body}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {section.list && (
                <div className='mt-6 grid gap-4 md:grid-cols-2'>
                    {section.list.map((item, i) => (
                        <div
                            key={i}
                            className='border-l-4  max-w-[400px] w-full p-6 border-l-[var(--hp-color-primary)] bg-[#EEEEF0] px-5 py-4'
                        >
                            <p
                                className='text-xs font-medium font-roboto uppercase text-[var(--hp-color-primary)]'
                            >
                                {item.title}
                            </p>
                            <p
                                className='mt-2 text-base text-[#404849]'
                            >
                                {item.body}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {section.paragraphs && renderParagraphsAfterList && (
                <div className='mt-6 space-y-4'>
                    {section.paragraphs.map((p, i) => (
                        <p
                            key={i}
                            className='text-base leading-normal text-neutral-600 sm:text-lg'
                        >
                            {p}
                        </p>
                    ))}
                </div>
            )}

            {section.id === 'payment-terms' ? (
                <div className='mt-[80px] max-w-[832px]'>
                    <Image
                        src='/images/pages/terms/mountain.svg'
                        alt='Mountain landscape'
                        width={832}
                        height={280}
                        className='h-auto w-full'
                    />
                </div>
            ) : null}

            {section.id === 'liability-law' ? (
                <div className='mt-20 flex max-w-[832px] flex-col items-start justify-between gap-6 border border-[#D5DADD] bg-[#EEF1F3] px-6 py-6 sm:flex-row sm:items-center sm:p-10'>
                    <div>
                        <h3
                            className='text-[24px] leading-[32px] text-[var(--hp-color-primary)]'
                        >
                            Have questions about our terms?
                        </h3>
                        <p
                            className='mt-2 text-base text-[#404849]'
                        >
                            Our legal team is here to provide clarity on any aspect of our service agreement.
                        </p>
                    </div>

                    <Button type='button' className='min-w-[180px]'>
                        Contact Support
                    </Button>
                </div>
            ) : null}
        </div>
    )
}

export default function TermsPage() {
    const [activeId, setActiveId] = useState(termsSections[0].id)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const scrollEl =
            document.getElementById('app-scroll-container') ?? window

        const onScroll = () => {
            for (let i = termsSections.length - 1; i >= 0; i--) {
                const el = document.getElementById(termsSections[i].id)
                if (el && el.getBoundingClientRect().top <= 120) {
                    setActiveId(termsSections[i].id)
                    break
                }
            }
        }

        scrollEl.addEventListener('scroll', onScroll, { passive: true })
        return () => scrollEl.removeEventListener('scroll', onScroll)
    }, [])

    const scrollTo = (id: string) => {
        const el = document.getElementById(id)
        if (!el) return
        const scrollEl = document.getElementById('app-scroll-container')
        if (scrollEl) {
            const top = el.offsetTop - 80
            scrollEl.scrollTo({ top, behavior: 'smooth' })
        } else {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    return (
        <main className='min-h-screen bg-[#F7F8FA]'>

            <div className='bg-[#F7F8FA] pt-8 sm:pt-[40px] lg:pt-[55px]'>
                <div className='mx-auto w-full max-w-[1182px] px-0'>
                    <h1
                        className='font-heading text-[36px] font-bold leading-tight text-[var(--hp-color-primary)] sm:text-[48px] lg:text-[72px]'
                    >
                        Legal Framework
                    </h1>
                    <p className='mt-4 max-w-2xl text-base text-[#404849] sm:text-xl leading-[28px]'>
                        Last Updated: May 24, 2024. Please read these terms carefully before booking
                        your adventure across Pakistan.
                    </p>
                </div>
            </div>

            <div className='mx-auto w-full max-w-[1182px] px-0 pb-20 pt-16'>
                <div className='flex flex-col gap-4 lg:flex-row lg:gap-8'>

                    {/* Sticky sidebar TOC */}
                    <aside className='w-full shrink-0 lg:w-[288px] lg:min-w-[288px] lg:max-w-[288px]'>
                        <div className='sticky top-10 rounded-[4px] border border-[#C0C8C9] bg-[#fff] p-[33px] shadow-[0_2px_10px_rgba(20,20,31,0.05)]'>
                            <p
                                className={cn(
                                    'font-roboto text-[12px] font-semibold uppercase leading-4 tracking-[1.2px] text-[#404849]',
                                )}
                            >
                                Contents
                            </p>
                            <div className='mb-[24px] mt-[8px] h-[2px] w-full bg-[#C0C8C9]' />
                            <div className='flex flex-col gap-4'>
                                {termsSections.map((s) => (
                                    <button
                                        key={s.id}
                                        type='button'
                                        onClick={() => scrollTo(s.id)}
                                        className={cn(
                                            'font-roboto relative flex items-center gap-4 rounded pl-[16px]  text-left text-[12px] font-medium leading-4 tracking-[0.01em] transition-colors',
                                            activeId === s.id
                                                ? 'text-[var(--hp-color-primary)]'
                                                : 'text-[#5E666C] hover:text-[var(--hp-color-primary)]',
                                        )}
                                    >
                                        {activeId === s.id && (
                                            <span className='absolute left-0 top-1/2 h-[16px] w-[2px] font-roboto -translate-y-1/2 rounded-full bg-[var(--hp-color-primary)]' />
                                        )}
                                        <span>{s.index}.</span>
                                        <span className='font-roboto '>{s.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main content */}
                    <div ref={containerRef} className='min-w-0 flex-1 space-y-14 sm:space-y-16 lg:space-y-20'>
                        {termsSections.map((section) => (
                            <SectionContent key={section.id} section={section} />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}
