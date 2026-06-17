'use client'

import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import { STATIC_UI_COLORS } from '@/data/homepage'
import type { Member } from '@/services/homepage/homepage.page.types'
import Image from 'next/image'
import React from 'react'

function TeamCard({ name, role, image }: Member) {
    return (
        <article className='overflow-hidden rounded-2xl bg-neutral-100 shadow-sm max-w-[306px] w-full h-[424px]'>
            <div className='relative aspect-[3/4] w-full bg-neutral-200 h-[300px]'>
                <Image
                    src={image}
                    alt={name}
                    fill
                    className='object-cover object-top'
                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
                />
            </div>
            <div
                className='px-4 py-5 text-center sm:px-5 sm:py-6 max-w-[306px] h-[124px]'
                style={{ backgroundColor: STATIC_UI_COLORS.backgroundMuted }}
            >
                <h3
                    className='text-xl font-medium leading-7 sm:text-2xl'
                    style={{ color: STATIC_UI_COLORS.title, fontFamily: 'var(--hp-font-heading)' }}
                >
                    {name}
                </h3>
                <p
                    className='pt-1 text-sm font-normal leading-6 sm:text-base'
                    style={{ color: STATIC_UI_COLORS.textMuted, fontFamily: 'var(--hp-font-body)' }}
                >
                    {role}
                </p>
            </div>
        </article>
    )
}

const MeetOurTeam = ({ page }: HomepagePageProps) => {
    const section = page.sections.meetOurTeam

    return (
        <section className='bg-white' aria-labelledby='meet-our-team-heading'>
            <div className='agency-container'>
                <header className='mx-auto max-w-3xl text-center'>
                    <SectionEyebrow name={section.eyebrow} />
                    <h2
                        id='meet-our-team-heading'
                        className='agency-section-heading pt-3 text-[40px] font-medium leading-[48px] sm:pt-4'
                        style={{ color: STATIC_UI_COLORS.title, fontFamily: 'var(--hp-font-heading)' }}
                    >
                        {section.title}
                    </h2>
                </header>

                <div className='mx-auto grid max-w-[1200px] grid-cols-1 gap-6 pt-10 sm:grid-cols-2 sm:gap-8 sm:pt-12 lg:grid-cols-4 lg:gap-8 lg:pt-14'>
                    {(section.members ?? []).map((member) => (
                        <TeamCard key={member.name} {...member} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default MeetOurTeam
