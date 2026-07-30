'use client'

import { EmptyState } from '@/components/ui/EmptyState'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import { resolveThemeAssetUrl } from '@/lib/media/resolve-theme-asset'
import type { MeetOurTeamSection } from '@/services/agency/agency.types'
import { cn } from '@/lib/utils/cn'

const GRADIENTS = [
    'from-[#F4A261] to-[#E76F51]',
    'from-[#2A9D8F] to-[#457B9D]',
    'from-[#9B5DE5] to-[#F15BB5]',
    'from-[#E9C46A] to-[#F4A261]',
]

export function Team({ data }: { data: MeetOurTeamSection }) {
    const variant = useTemplateVariant()
    const members = data.members ?? []

    if (variant === 'temp1') {
        return (
            <section className="section-spacing section-spacing-top bg-[#F7FAFA]">
                <div className="site-container">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-sm font-medium uppercase text-[#0B6E6A]">
                            {data.eyebrow}
                        </p>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111] md:text-4xl">
                            {data.title}
                        </h2>
                    </div>

                    {members.length === 0 ? (
                        <div className="mt-10">
                            <EmptyState
                                title="Team coming soon"
                                description="Add team members in the site theme to introduce your guides and planners."
                            />
                        </div>
                    ) : (
                        <div className="-mx-4 mt-10 flex gap-8 overflow-x-auto px-4 pb-4 md:-mx-6 md:px-6">
                            {members.map((member, i) => {
                                const image = resolveThemeAssetUrl(member.image)
                                return (
                                    <article
                                        key={`${member.name}-${i}`}
                                        className="w-[160px] shrink-0 text-center sm:w-[180px]"
                                    >
                                        <div
                                            className={cn(
                                                'mx-auto aspect-square w-[120px] overflow-hidden rounded-full bg-gradient-to-br bg-cover bg-center ring-4 ring-white shadow-md sm:w-[140px]',
                                                !image && GRADIENTS[i % GRADIENTS.length]
                                            )}
                                            style={
                                                image
                                                    ? { backgroundImage: `url(${image})` }
                                                    : undefined
                                            }
                                            role="img"
                                            aria-label={member.name}
                                        />
                                        <p className="mt-4 font-semibold text-[#111]">
                                            {member.name}
                                        </p>
                                        <p className="mt-1 text-sm text-[#666]">{member.role}</p>
                                    </article>
                                )
                            })}
                        </div>
                    )}
                </div>
            </section>
        )
    }

    if (variant === 'temp2') {
        return (
            <section className="bg-[#FCF8F3] py-16 md:py-20">
                <div className="site-container">
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#888]">
                        {data.eyebrow}
                    </p>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111] md:text-4xl">
                        {data.title}
                    </h2>

                    {members.length === 0 ? (
                        <div className="mt-10">
                            <EmptyState
                                title="Team coming soon"
                                description="Add team members in the site theme to introduce your guides and planners."
                            />
                        </div>
                    ) : (
                        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {members.map((member, i) => {
                                const image = resolveThemeAssetUrl(member.image)
                                return (
                                    <article key={`${member.name}-${i}`} className="text-center">
                                        <div
                                            className={cn(
                                                'aspect-square w-full overflow-hidden rounded-[24px] bg-gradient-to-br bg-cover bg-center',
                                                !image && GRADIENTS[i % GRADIENTS.length]
                                            )}
                                            style={
                                                image
                                                    ? { backgroundImage: `url(${image})` }
                                                    : undefined
                                            }
                                            role="img"
                                            aria-label={member.name}
                                        />
                                        <p className="mt-4 font-semibold text-[#111]">
                                            {member.name}
                                        </p>
                                        <p className="text-sm text-[#666]">{member.role}</p>
                                    </article>
                                )
                            })}
                        </div>
                    )}
                </div>
            </section>
        )
    }

    return null
}
