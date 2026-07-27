'use client'

import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import type { Member } from '@/services/homepage/homepage.page.types'
import { useTemplateStyles } from '@/components/providers/TemplateStylesProvider'
import { STATIC_UI_COLORS } from '@/data/homepage'
import {
    configureSwiperNavigation,
    SwiperSideNavigation,
    useSwiperNavigationRefs,
} from '@/components/ui/swiper-side-navigation'
import { HomepageMediaImage } from '@/components/ui/homepage-media-image'
import { cn } from '@/lib/utils/clsxUtils'
import React from 'react'
import { Autoplay, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

function TeamCard({ name, role, image }: Member) {
    const team = useTemplateStyles().pages.home.team

    return (
        <article className={cn(team.card)}>
            <div className='relative aspect-[3/4] w-full bg-neutral-200 sm:aspect-auto sm:h-[300px]'>
                <HomepageMediaImage
                    src={image}
                    alt={name}
                    fill
                    className='object-cover object-top'
                    sizes='(max-width: 640px) 45vw, (max-width: 1024px) 50vw, 25vw'
                />
            </div>
            <div
                className={cn(team.cardBody)}
                style={{ backgroundColor: STATIC_UI_COLORS.backgroundMuted }}
            >
                <h3
                    className='text-sm font-medium leading-5 sm:text-xl sm:leading-7 lg:text-2xl'
                    style={{ color: STATIC_UI_COLORS.title, fontFamily: 'var(--hp-font-heading)' }}
                >
                    {name}
                </h3>
                <p
                    className='pt-0.5 text-xs font-normal leading-5 sm:pt-1 sm:text-sm sm:leading-6 lg:text-base'
                    style={{ color: STATIC_UI_COLORS.textMuted, fontFamily: 'var(--hp-font-body)' }}
                >
                    {role}
                </p>
            </div>
        </article>
    )
}

const TEAM_CAROUSEL_THRESHOLD = 4

function TeamMembersSwiper({ members }: { members: Member[] }) {
    const { prevRef, nextRef } = useSwiperNavigationRefs()

    return (
        <Swiper
            modules={[Navigation, Autoplay]}
            slidesPerView={2}
            spaceBetween={12}
            breakpoints={{
                640: {
                    slidesPerView: 2,
                    spaceBetween: 24,
                },
                1024: {
                    slidesPerView: 4,
                    spaceBetween: 32,
                },
            }}
            loop
            speed={600}
            autoplay={{
                delay: 4500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            }}
            navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
                configureSwiperNavigation(swiper, prevRef.current, nextRef.current)
            }}
            className='select-none !overflow-hidden'
        >
            {members.map((member) => (
                <SwiperSlide key={member.name} className='!h-auto'>
                    <TeamCard {...member} />
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

const MeetOurTeam = ({ page }: HomepagePageProps) => {
    const section = page.sections.meetOurTeam
    const members = section.members ?? []
    const useCarousel = members.length > TEAM_CAROUSEL_THRESHOLD
    const team = useTemplateStyles().pages.home.team
    const sectionHeader = useTemplateStyles().pages.home.sectionHeader

    return (
        <section className='bg-white' aria-labelledby='meet-our-team-heading'>
            <div className='agency-container'>
                <header className={cn(team.header)}>
                    <SectionEyebrow name={section.eyebrow} className={sectionHeader.eyebrow} />
                    <h2
                        id='meet-our-team-heading'
                        className={cn(
                            sectionHeader.title,
                            'pt-3 text-[40px] font-medium leading-[48px] sm:pt-4',
                        )}
                        style={{ color: STATIC_UI_COLORS.title, fontFamily: 'var(--hp-font-heading)' }}
                    >
                        {section.title}
                    </h2>
                </header>

                {useCarousel ? (
                    <div className='w-full overflow-x-hidden pt-6 sm:pt-8 lg:pt-10'>
                        <SwiperSideNavigation
                            prevLabel='Previous team members'
                            nextLabel='Next team members'
                        >
                            <TeamMembersSwiper members={members} />
                        </SwiperSideNavigation>
                    </div>
                ) : (
                    <div className={cn(team.grid)}>
                        {members.map((member) => (
                            <TeamCard key={member.name} {...member} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default MeetOurTeam
