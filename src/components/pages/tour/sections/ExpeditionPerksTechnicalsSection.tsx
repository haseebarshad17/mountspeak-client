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
            className="border-t border-black/[0.06] bg-[#ECECE8] py-8 sm:py-10 lg:py-16"
        >
            <div className="agency-container !px-16">
                <h2 className="text-center font-heading text-3xl font-bold font-heading text-[#191C1C] sm:text-4xl">
                    {perksAndTechnicalsSection.title}
                </h2>
                <div className="mt-[48px] grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {perksAndTechnicalsSection.items.map((item) => {
                        const Icon = perkIcons[item.icon] ?? Mountain
                        return (
                            <article
                                key={item.title}
                                className="flex flex-col items-center  bg-white px-8 py-8 text-center shadow-sm"
                            >
                                <Icon
                                    className="h-8 w-8"
                                    style={{ color: theme.secondaryColor }}
                                    strokeWidth={1.75}
                                />
                                <h3 className="mt-6 text-base leading-6 font-roboto text-[#191C1C]">
                                    {item.title}
                                </h3>
                                <p className="mt-2 text-xs text-[#434849] font-roboto">
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
