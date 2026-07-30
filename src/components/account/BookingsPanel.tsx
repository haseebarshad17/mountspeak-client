'use client'

import { useState } from 'react'
import { AgencyLink } from '@/components/links/AgencyLink'
import { EmptyState } from '@/components/ui/EmptyState'
import { useOptionalUser } from '@/services/auth/auth.query'
import { useUserBookings } from '@/services/user-bookings/user-bookings.query'
import { isValidAgencyId } from '@/services/specialization/specialization.service'
import { cn } from '@/lib/utils/cn'

function statusClass(tone: string) {
    if (tone === 'confirmed') return 'bg-[#D1FAE5] text-[#065F46]'
    if (tone === 'action') return 'bg-[#FFEDD5] text-[#9A3412]'
    if (tone === 'pending') return 'bg-[#E0F2FE] text-[#075985]'
    if (tone === 'cancelled') return 'bg-[#FEE2E2] text-[#991B1B]'
    return 'bg-[#F3F4F6] text-[#4B5563]'
}

export function BookingsPanel({ agencyId }: { agencyId: string }) {
    const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')
    const { data: user } = useOptionalUser()
    const { data, isLoading } = useUserBookings(
        user?.email,
        isValidAgencyId(agencyId) ? agencyId : undefined
    )

    const upcoming = data?.upcoming ?? []
    const past = data?.past ?? []

    return (
        <div>
            <div className="flex gap-5 border-b border-black/10">
                {(
                    [
                        ['upcoming', `Upcoming (${upcoming.length})`],
                        ['past', `Past (${past.length})`],
                    ] as const
                ).map(([key, label]) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => setTab(key)}
                        className={cn(
                            'pb-3 text-sm font-medium transition',
                            tab === key
                                ? 'border-b-2 border-[#111] text-[#111]'
                                : 'border-b-2 border-transparent text-[#888]'
                        )}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="mt-6 space-y-3">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-28 animate-pulse rounded-2xl bg-white"
                        />
                    ))}
                </div>
            ) : tab === 'upcoming' ? (
                upcoming.length === 0 ? (
                    <div className="mt-6">
                        <EmptyState
                            title="No upcoming bookings"
                            description="When you reserve a tour or package, it will show up here."
                        />
                        <div className="mt-4">
                            <AgencyLink
                                href="/tours"
                                className="inline-flex rounded-full bg-[#111] px-5 py-2.5 text-sm font-medium text-white"
                            >
                                Browse tours
                            </AgencyLink>
                        </div>
                    </div>
                ) : (
                    <div className="mt-6 space-y-4">
                        {upcoming.map((booking) => (
                            <article
                                key={booking.id}
                                className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm md:flex"
                            >
                                <div className="aspect-[16/10] bg-[#EDE7DE] md:aspect-auto md:w-48 md:shrink-0">
                                    {booking.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={booking.image}
                                            alt={booking.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : null}
                                </div>
                                <div className="flex flex-1 flex-col justify-between p-4 md:p-5">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span
                                                className={cn(
                                                    'rounded-full px-2.5 py-0.5 text-[11px] font-medium',
                                                    statusClass(booking.statusTone)
                                                )}
                                            >
                                                {booking.status}
                                            </span>
                                            <span className="text-xs text-[#888]">
                                                {booking.referenceId}
                                            </span>
                                        </div>
                                        <h3 className="mt-2 text-lg font-semibold text-[#111]">
                                            {booking.title}
                                        </h3>
                                        <p className="mt-1 text-sm text-[#666]">
                                            {booking.location} · {booking.schedule}
                                        </p>
                                        <p className="mt-1 text-xs text-[#888]">
                                            {booking.members}
                                        </p>
                                        {booking.warning ? (
                                            <p className="mt-2 text-xs text-[#9A3412]">
                                                {booking.warning}
                                            </p>
                                        ) : null}
                                    </div>
                                    {booking.slug ? (
                                        <AgencyLink
                                            href={`/tours/${booking.slug}`}
                                            className="mt-4 inline-flex w-fit rounded-lg border border-black/10 px-3 py-2 text-xs font-medium text-[#111]"
                                        >
                                            View itinerary
                                        </AgencyLink>
                                    ) : null}
                                </div>
                            </article>
                        ))}
                    </div>
                )
            ) : past.length === 0 ? (
                <div className="mt-6">
                    <EmptyState
                        title="No past trips yet"
                        description="Completed and cancelled bookings will appear in this tab."
                    />
                </div>
            ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {past.map((booking) => (
                        <article
                            key={booking.id}
                            className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span
                                    className={cn(
                                        'rounded-full px-2.5 py-0.5 text-[11px] font-medium',
                                        statusClass(booking.statusTone)
                                    )}
                                >
                                    {booking.status}
                                </span>
                                <span className="text-xs text-[#888]">{booking.date}</span>
                            </div>
                            <h3 className="mt-3 font-semibold text-[#111]">
                                {booking.title}
                            </h3>
                            <p className="mt-1 text-sm text-[#666]">{booking.note}</p>
                            {booking.slug ? (
                                <AgencyLink
                                    href={`/tours/${booking.slug}`}
                                    className="mt-4 inline-flex text-xs font-medium text-[#06403D]"
                                >
                                    View tour →
                                </AgencyLink>
                            ) : null}
                        </article>
                    ))}
                </div>
            )}
        </div>
    )
}
