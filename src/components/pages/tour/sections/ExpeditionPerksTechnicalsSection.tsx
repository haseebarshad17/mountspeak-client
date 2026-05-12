import React from 'react'
import {
    BriefcaseMedical,
    ChefHat,
    Mountain,
    MountainSnow,
    Wifi,
    type LucideIcon,
} from 'lucide-react'

import type { TourPage } from './tour-page.types'

const perkIcons: Record<string, LucideIcon> = {
    'mountain-tools': MountainSnow,
    'chef-hat': ChefHat,
    wifi: Wifi,
    'medical-kit': BriefcaseMedical,
}

type ExpeditionPerksTechnicalsSectionProps = {
    page: TourPage
}

export function ExpeditionPerksTechnicalsSection({
    page,
}: ExpeditionPerksTechnicalsSectionProps) {
    const { perksAndTechnicalsSection, theme } = page

    return (
        <section
            id={perksAndTechnicalsSection.id}
            className="border-t border-black/[0.06] py-16 sm:py-20"
            style={{ backgroundColor: '#ECECE8' }}
        >
            <div className="agency-container">
                <h2 className="text-center font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                    {perksAndTechnicalsSection.title}
                </h2>
                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {perksAndTechnicalsSection.items.map((item) => {
                        const Icon = perkIcons[item.icon] ?? Mountain
                        return (
                            <article
                                key={item.title}
                                className="flex flex-col items-center rounded-xl border border-black/[0.06] bg-white px-5 py-8 text-center shadow-sm"
                            >
                                <span
                                    className="flex h-12 w-12 items-center justify-center rounded-full"
                                    style={{
                                        backgroundColor: `${theme.secondaryColor}18`,
                                        color: theme.secondaryColor,
                                    }}
                                >
                                    <Icon className="h-6 w-6" />
                                </span>
                                <h3 className="mt-5 font-heading text-lg font-semibold text-neutral-900">
                                    {item.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                                    {item.description}
                                </p>
                            </article>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
