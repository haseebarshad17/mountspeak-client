'use client'

import React from 'react'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { TourMediaImage } from '@/components/pages/tour/TourMediaImage'

import type { TourPage } from './tour-page.types'

type PlacesVisitedCardsSectionProps = {
    page: TourPage
}

type PlaceCard = TourPage['placesVisitedSection']['cards'][number]

function PlaceVisitedCard({ card }: { card: PlaceCard }) {
    return (
        <article className="group h-full">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
                <TourMediaImage
                    src={card.thumbnail}
                    alt={card.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 639px) 85vw, 25vw"
                />
            </div>
            <h3 className="mt-4 font-heading text-lg font-semibold text-[#191C1C] sm:text-xl">
                {card.title}
            </h3>
            {card.location?.trim() ? (
                <p className="mt-1.5 font-roboto text-xs font-medium uppercase text-[#434849]">
                    {card.location}
                </p>
            ) : null}
        </article>
    )
}

function PlacesVisitedMobileSwiper({ cards, canSlide }: { cards: PlaceCard[]; canSlide: boolean }) {
    return (
        <Swiper
            modules={[Autoplay]}
            slidesPerView={1.12}
            spaceBetween={16}
            speed={500}
            loop={canSlide}
            autoplay={
                canSlide
                    ? {
                        delay: 4500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }
                    : false
            }
            className="select-none !overflow-hidden"
        >
            {cards.map((card) => (
                <SwiperSlide key={card.id} className="!h-auto">
                    <PlaceVisitedCard card={card} />
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

export function PlacesVisitedCardsSection({ page }: PlacesVisitedCardsSectionProps) {
    const { placesVisitedSection } = page
    const { cards } = placesVisitedSection
    const canSlide = cards.length > 1

    return (
        <section id={placesVisitedSection.id} className="overflow-x-hidden bg-white py-8 sm:py-10 lg:py-16">
            <div className="agency-container px-4 sm:px-8 lg:px-16">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
                    <div className="shrink-0">
                        <h2 className="font-heading text-2xl font-semibold tracking-tight text-[#191C1C] sm:text-3xl lg:text-4xl">
                            {placesVisitedSection.title}
                        </h2>
                    </div>
                    <p className="text-sm leading-normal text-[#434849] lg:max-w-md lg:pt-6 lg:text-base">
                        {placesVisitedSection.intro}
                    </p>
                </div>

                <div className="mt-[35px] min-w-0 overflow-x-hidden sm:hidden">
                    <PlacesVisitedMobileSwiper cards={cards} canSlide={canSlide} />
                </div>

                <div className="mt-[35px] hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
                    {cards.map((card) => (
                        <PlaceVisitedCard key={card.id} card={card} />
                    ))}
                </div>
            </div>
        </section>
    )
}
