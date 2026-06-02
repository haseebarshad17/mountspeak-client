"use client"

import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import HeroFilters from "@/components/pages/marketing/home/HeroFilters"

const tourResults = [
    {
        discount: "15.00% Off",
        title: "3 DAYS NEELUM VALLEY TOUR - PARADISE ON EARTH",
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    },
    {
        discount: "15.00% Off",
        title: "7 DAYS TRIP TO SKARDU & BASHO VALLEY",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    },
    {
        discount: "10.00% Off",
        title: "3 DAYS TRIP TO NARAN - SHOGRAN - SAIF-UL-MALOOK LAKE",
        image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
    },
    {
        discount: "20.00% Off",
        title: "2 DAYS TRIP TOWARDS SHOGRAN",
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
    },
    {
        discount: "12.00% Off",
        title: "6 DAYS TRIP TO SKARDU VALLEY - SHANGRILLA & MANTHOKHA WATERFALL",
        image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
    },
    {
        discount: "8.00% Off",
        title: "3 DAYS NARAN SHOGRAN SAIF-UL-MALOOK ADVENTURE",
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
    },
] as const

function SearchResultCard({
    discount,
    title,
    image,
}: {
    discount: string
    title: string
    image: string
}) {
    return (
        <article className="group relative mx-auto w-full max-w-[416px] min-h-[240px] overflow-hidden rounded-[10px] lg:mx-0 lg:min-h-[300px]">
            <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 416px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />

            <div className="absolute left-1/2 top-4 w-[calc(100%-1.5rem)] max-w-[356px] -translate-x-1/2">
                <span className="inline-flex min-h-[50px] w-full items-center justify-center rounded-full bg-[#276968] px-5 py-2 font-roboto text-sm font-medium text-white">
                    {discount}
                </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-4 pb-5 pt-14 text-center">
                <h3 className="font-jost text-[20px] font-medium uppercase leading-snug tracking-wide text-white">
                    {title}
                </h3>
                <Link
                    href="/detail"
                    className="mt-3 inline-flex items-center gap-1.5 font-roboto text-base font-normal text-white/95 transition-colors hover:text-white"
                >
                    View All Place
                    <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
                </Link>
            </div>
        </article>
    )
}

export default function SearchPage() {
    return (
        <main className="bg-white pb-16 pt-16">
            <section className="p-2 sm:p-3 md:p-4 lg:p-5 xl:p-[30px]">
                <div className='rounded-[16px] bg-[url("/images/pages/home/tour-list.png")] bg-cover bg-center bg-no-repeat'>
                    <div className="px-4 pb-8 pt-24 sm:px-6 sm:pb-10 sm:pt-28 md:pt-32 lg:pt-36">
                        <div className="mx-auto w-full max-w-[867px]">
                            <HeroFilters />
                        </div>
                    </div>
                </div>
            </section>

            <div className="agency-container pt-8">
                <div className="mx-auto max-w-[900px] text-center">
                    <h1 className="agency-section-heading text-[32px] font-medium leading-tight text-[#14141F] sm:text-[40px]">
                        Search Results
                    </h1>
                    <p className="pt-3 font-roboto text-base text-neutral-600">
                        Explore available trips and pick your next adventure.
                    </p>
                </div>

                <div className="grid grid-cols-1 justify-items-center gap-5 pt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:justify-items-stretch">
                    {tourResults.map((tour) => (
                        <SearchResultCard key={tour.title} {...tour} />
                    ))}
                </div>
            </div>
        </main>
    )
}
