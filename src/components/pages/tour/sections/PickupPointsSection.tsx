'use client'

import { MapPin } from 'lucide-react'

import { formatPickupTimeDisplay } from '@/services/tours/tours.pickup'

import type { TourPage } from './tour-page.types'

type PickupPointsSectionProps = {
    section: NonNullable<TourPage['pickupPointsSection']>
}

export function PickupPointsSection({ section }: PickupPointsSectionProps) {
    if (!section.points.length) return null

    return (
        <section id={section.id} className='bg-[var(--tour-bg)] px-4 py-14 sm:px-6 lg:px-8'>
            <div className='mx-auto max-w-5xl'>
                <p className='text-xs font-semibold uppercase tracking-[0.2em] text-[var(--tour-primary)]'>
                    Boarding cities
                </p>
                <h2 className='mt-2 font-heading text-3xl text-[var(--tour-text)]'>{section.title}</h2>
                {section.intro ? (
                    <p className='mt-3 max-w-3xl text-base text-neutral-600'>{section.intro}</p>
                ) : null}

                <div className='mt-8 grid gap-4 sm:grid-cols-2'>
                    {section.points.map((point) => (
                        <div
                            key={point.id}
                            className={`rounded-xl border px-4 py-4 ${
                                point.isPrimary
                                    ? 'border-[var(--tour-primary)]/30 bg-white shadow-sm'
                                    : 'border-neutral-200 bg-white/80'
                            }`}
                        >
                            <div className='flex items-start gap-3'>
                                <MapPin
                                    className={`mt-0.5 h-5 w-5 shrink-0 ${
                                        point.isPrimary ? 'text-[var(--tour-primary)]' : 'text-neutral-500'
                                    }`}
                                />
                                <div>
                                    <p className='font-medium text-[var(--tour-text)]'>{point.city}</p>
                                    <p className='mt-1 text-sm text-neutral-600'>
                                        {point.isPrimary ? 'Main departure' : 'Additional pickup'}
                                        {point.pickupTime
                                            ? ` · ${formatPickupTimeDisplay(point.pickupTime)}`
                                            : ''}
                                    </p>
                                    {point.notes ? (
                                        <p className='mt-2 text-sm text-neutral-500'>{point.notes}</p>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
