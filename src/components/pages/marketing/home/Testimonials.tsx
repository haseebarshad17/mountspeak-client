"use client"

import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import Image from "next/image"
import React, { useRef, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import type { Swiper as SwiperType } from "swiper/types"
import "swiper/css"
import { cn } from "@/lib/utils/clsxUtils"


const testimonials = [
    {
        name: "Alice Smith",
        quote:
            "A real sense of community, nurtured. Really appreciate the help and support from the staff during my trips. Very helpful and always available when needed.",
        avatar: "https://i.pravatar.cc/100?img=47",
    },
    {
        name: "Noah Martin",
        quote:
            "From booking to arrival, everything felt smooth and organized. The support team answered quickly and made our whole experience stress-free.",
        avatar: "https://i.pravatar.cc/100?img=12",
    },
    {
        name: "Sophia Khan",
        quote:
            "The tour quality exceeded expectations and the communication was excellent. I felt looked after from day one to the final return.",
        avatar: "https://i.pravatar.cc/100?img=5",
    },
    {
        name: "Ethan Parker",
        quote:
            "I loved the flexibility in planning and the level of detail throughout the journey. It made traveling with family easy and memorable.",
        avatar: "https://i.pravatar.cc/100?img=28",
    },
    {
        name: "Olivia Reed",
        quote:
            "Great destinations, clear pricing, and super responsive support. The whole platform feels designed around real travelers and their needs.",
        avatar: "https://i.pravatar.cc/100?img=23",
    },
]

const Testimonials = () => {
    const swiperRef = useRef<SwiperType | null>(null)
    const [activeIndex, setActiveIndex] = useState(0)

    return (
        <section className="overflow-hidden pb-16 sm:pb-20 lg:pb-[110px]">
            <main className="relative bg-[url('/images/pages/home/testimonial-background.png')] 
            bg-cover bg-center">
                <div className="agency-container relative z-10 px-3 py-10 sm:px-4 sm:py-12 lg:py-14">
                    <header className="text-center text-white">
                        <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/90">
                            Testimonials
                        </p>
                        <h2 className="pt-2 agency-section-heading">
                            What they say about us
                        </h2>
                    </header>

                    {/* Only rating, quote, name slide */}
                    <div className="relative mx-auto mt-8 max-w-[720px] px-7 sm:mt-10 sm:px-10 lg:px-0">
                        <Swiper
                            slidesPerView={1}
                            loop
                            speed={600}
                            onBeforeInit={(swiper) => {
                                swiperRef.current = swiper
                            }}
                            onSlideChange={(swiper) => {
                                setActiveIndex(swiper.realIndex)
                            }}
                            className="w-full user-select-none select-none"
                        >
                            {testimonials.map((item) => (
                                <SwiperSlide key={item.name}>
                                    <div className="flex flex-col items-center px-2 text-center text-white">
                                        <div className="flex items-center gap-1 text-amber-400">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className="h-4 w-4 fill-current sm:h-5 sm:w-5"
                                                />
                                            ))}
                                        </div>
                                        <p className="mt-5 max-w-[640px] text-sm leading-7 text-white/92 sm:text-base sm:leading-8">
                                            &ldquo;{item.quote}&rdquo;
                                        </p>
                                        <h3 className="mt-7 text-xl font-semibold sm:text-2xl lg:text-[28px]">
                                            {item.name}
                                        </h3>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <button
                            type="button"
                            aria-label="Previous testimonial"
                            onClick={() => swiperRef.current?.slidePrev()}
                            className="absolute left-0 top-[42%] z-10 -translate-y-1/2 text-amber-400 
                            transition hover:text-amber-300 lg:-left-6"
                        >
                            <ChevronLeft className="h-8 w-8 sm:h-11 sm:w-11" strokeWidth={1.5} />
                        </button>
                        <button
                            type="button"
                            aria-label="Next testimonial"
                            onClick={() => swiperRef.current?.slideNext()}
                            className="absolute right-0 top-[42%] z-10 -translate-y-1/2 text-amber-400 
                        transition hover:text-amber-300 lg:-right-6"
                        >
                            <ChevronRight className="h-8 w-8 sm:h-11 sm:w-11" strokeWidth={1.5} />
                        </button>
                    </div>

                    {/* Avatar pagination */}
                    <div className="mx-auto mt-7 flex max-w-full items-center justify-center sm:mt-9 gap-4">
                        {testimonials.map((person, idx) => {
                            const isActive = idx === activeIndex
                            return (
                                <button
                                    key={person.name}
                                    type="button"
                                    onClick={() => swiperRef.current?.slideToLoop(idx)}
                                    className={cn(
                                        "relative shrink-0 overflow-hidden rounded-full ring-2 transition-all duration-300 ease-out",
                                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2",
                                        "focus-visible:ring-offset-transparent h-8 w-8 sm:h-10 sm:w-10 md:h-11 md:w-11",
                                        isActive
                                            ? "z-[1] ring-amber-400 scale-110 sm:scale-115 md:scale-125"
                                            : "opacity-90 ring-white/45 hover:opacity-100"
                                    )}
                                    aria-label={`Show testimonial from ${person.name}`}
                                    aria-current={isActive ? "true" : undefined}
                                >
                                    <Image
                                        src={person.avatar}
                                        alt={person.name}
                                        fill
                                        className="object-cover"
                                        sizes="72px"
                                    />
                                </button>
                            )
                        })}
                    </div>

                    {/* Dot indicators (synced with slides) */}
                    <div className="pt-10 flex items-center justify-center gap-2">
                        {testimonials.map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                aria-label={`Go to testimonial ${idx + 1}`}
                                onClick={() => swiperRef.current?.slideToLoop(idx)}
                                className={`h-2 rounded-full transition-all duration-300 ${idx === activeIndex
                                    ? "w-5 bg-amber-400"
                                    : "w-2 bg-white/65 hover:bg-white/85"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </section>
    )
}

export default Testimonials
