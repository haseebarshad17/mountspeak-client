'use client'

import { useEffect, useRef, useState } from 'react'
import { FileText, Globe, Lock, Eye, Shield } from 'lucide-react'
import { Montserrat_Alternates } from 'next/font/google'
import { cn } from '@/lib/utils/clsxUtils'
import { termsSections, type TermsSection } from './terms-content'

const montserratAlternates = Montserrat_Alternates({
    subsets: ['latin'],
    weight: ['500', '600'],
    display: 'swap',
})

const ICON_MAP: Record<string, React.ReactNode> = {
    shield: <Shield className='h-5 w-5' />,
    globe: <Globe className='h-5 w-5' />,
    file: <FileText className='h-5 w-5' />,
    lock: <Lock className='h-5 w-5' />,
    eye: <Eye className='h-5 w-5' />,
}

function SectionContent({ section }: { section: TermsSection }) {
    return (
        <div id={section.id} className='scroll-mt-8'>
            <span className='inline-block rounded-full border border-neutral-300 bg-neutral-100 px-3 py-1 font-mono text-xs text-neutral-500'>
                {section.badge}
            </span>

            <h2 className='mt-3 font-heading text-[28px] font-semibold leading-tight text-neutral-900 sm:text-[34px] lg:text-[40px]'>
                {section.heading}
            </h2>

            {section.paragraphs && (
                <div className='mt-4 space-y-4'>
                    {section.paragraphs.map((p, i) => (
                        <p key={i} className='text-sm leading-relaxed text-neutral-600 sm:text-base'>
                            {p}
                        </p>
                    ))}
                </div>
            )}

            {section.items && (
                <div className='mt-6 space-y-5'>
                    {section.items.map((item) => (
                        <div key={item.title} className='flex items-start gap-4'>
                            <span className='mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary-200 bg-primary-50 text-primary-700'>
                                {ICON_MAP[item.icon] ?? <Shield className='h-5 w-5' />}
                            </span>
                            <div>
                                <p className='font-semibold text-neutral-800'>{item.title}</p>
                                <p className='mt-1 text-sm leading-relaxed text-neutral-600'>
                                    {item.body}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {section.list && (
                <div className='mt-6 divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-neutral-50'>
                    {section.list.map((item, i) => (
                        <div key={i} className='px-5 py-4'>
                            <p className='font-semibold text-neutral-800'>{item.title}</p>
                            <p className='mt-1 text-sm leading-relaxed text-neutral-600'>{item.body}</p>
                        </div>
                    ))}
                </div>
            )}
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
            {/* Page header */}
            <div className='bg-[#F7F8FA] pb-8 pt-12 sm:pt-14 lg:pt-16'>
                <div className='mx-auto w-full max-w-[1182px] px-[15px]'>
                    <h1 className='font-heading text-[36px] font-bold leading-tight text-[#00292C] sm:text-[48px] lg:text-[58px]'>
                        Legal Framework
                    </h1>
                    <p className='mt-3 max-w-xl text-sm text-neutral-500 sm:text-base'>
                        Last Updated: May 24, 2024. Please read these terms carefully before booking
                        your adventure across Pakistan.
                    </p>
                </div>
            </div>

            <div className='mx-auto w-full max-w-[1182px] px-[15px] pb-20 pt-8'>
                <div className='flex flex-col gap-10 lg:flex-row lg:gap-12 xl:gap-16'>

                    {/* Sticky sidebar TOC */}
                    <aside className='shrink-0 w-[288px]'>
                        <div className='sticky top-10 rounded-[4px] border-2 border-[#C0C8C9] bg-[#fff] p-[33px] shadow-[0_2px_10px_rgba(20,20,31,0.05)]'>
                            <p
                                className={cn(
                                    montserratAlternates.className,
                                    'text-[12px] font-semibold uppercase leading-4 tracking-[1.2px] text-[#4A545A]',
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
                                            montserratAlternates.className,
                                            'relative flex items-center gap-4 rounded pl-[16px] text-left text-[12px] font-medium leading-4 tracking-[0.01em] transition-colors',
                                            activeId === s.id
                                                ? 'text-[#00292C]'
                                                : 'text-[#5E666C] hover:text-[#00292C]',
                                        )}
                                    >
                                        {activeId === s.id && (
                                            <span className='absolute left-0 top-1/2 h-[16px] w-[2px] -translate-y-1/2 rounded-full bg-[#00292C]' />
                                        )}
                                        <span>{s.index}.</span>
                                        <span>{s.label}</span>
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
