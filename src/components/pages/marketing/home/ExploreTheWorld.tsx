import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const tours = [
    {
        discount: '15.00% Off',
        title: '3 DAYS NEELUM VALLEY TOUR - PARADISE ON EARTH',
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    },
    {
        discount: '15.00% Off',
        title: '7 DAYS TRIP TO SKARDU & BASHO VALLEY',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    },
    {
        discount: '10.00% Off',
        title: '3 DAYS TRIP TO NARAN - SHOGRAN - SAIF-UL-MALOOK LAKE',
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    },
    {
        discount: '20.00% Off',
        title: '2 DAYS TRIP TOWARDS SHOGRAN',
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    },
    {
        discount: '12.00% Off',
        title: '6 DAYS TRIP TO SKARDU VALLEY - SHANGRILLA & MANTHOKHA WATERFALL',
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
    },
    {
        discount: '8.00% Off',
        title: '3 DAYS NARAN SHOGRAN SAIF-UL-MALOOK ADVENTURE',
        image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
    },
    {
        discount: '20.00% Off',
        title: '5 DAYS TOUR TO FAIRY MEADOWS & NANGA PARBAT BASE CAMP',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
    },
    {
        discount: '18.00% Off',
        title: '6 DAYS SKARDU VALLEY PREMIUM TOUR',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    },
    {
        discount: '25.00% Off',
        title: '5 DAYS HUNZA BY AIR TRIP',
        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    },
] as const

function TourCard({
    discount,
    title,
    image,
}: {
    discount: string
    title: string
    image: string
}) {
    return (
        <article className='group relative mx-auto w-full max-w-[416px] overflow-hidden rounded-[10px] aspect-[416/300] min-h-[220px] sm:min-h-[260px] lg:mx-0 lg:min-h-[300px]'>
            <Image
                src={image}
                alt={title}
                fill
                className='object-cover'
                sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 416px'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10' />

            <div className='absolute left-1/2 top-3 w-[calc(100%-1.5rem)] max-w-[356px] -translate-x-1/2 sm:top-4 lg:top-5'>
                <span className='inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-[#276968] px-4 py-2 font-roboto text-xs font-medium leading-none text-white sm:min-h-[52px] sm:px-5 sm:text-sm lg:min-h-[64px] lg:px-6 lg:text-base'>
                    {discount}
                </span>
            </div>

            <div className='absolute inset-x-0 bottom-0 flex flex-col items-center px-3 pb-4 pt-12 text-center sm:px-4 sm:pb-5 sm:pt-14 lg:px-5 lg:pb-6 lg:pt-16'>
                <h3 className='font-jost text-[20px] font-medium uppercase leading-snug tracking-wide text-white'>
                    {title}
                </h3>
                <Link
                    href='#'
                    className='mt-2 inline-flex items-center gap-1.5 font-roboto text-base font-normal text-white/95 transition-colors hover:text-white sm:mt-3'
                >
                    View All Place
                    <ArrowRight className='h-3.5 w-3.5 sm:h-4 sm:w-4' strokeWidth={2} aria-hidden />
                </Link>
            </div>
        </article>
    )
}

const ExploreTheWorld = () => {
    return (
        <section
            className='overflow-hidden bg-white pb-12 sm:pb-16 md:pb-20 lg:pb-[112px]'
            aria-labelledby='explore-the-world-heading'
        >
            <div className='agency-container'>
                <header className='mx-auto max-w-[900px] px-1 text-center sm:px-0'>
                    <SectionEyebrow name='Explore Tour' />
                    <h2
                        id='explore-the-world-heading'
                        className='agency-section-heading pt-2 text-[28px] font-medium leading-tight text-[#14141F] sm:pt-3 sm:text-[34px] sm:leading-[40px] lg:pt-4 lg:text-[40px] lg:leading-[48px]'
                    >
                        The World
                    </h2>
                    <p className='mx-auto max-w-[861px] pt-3 font-roboto text-sm font-normal leading-6 text-neutral-600 sm:pt-4 sm:text-base sm:leading-7 md:pt-5 md:text-lg md:leading-8'>
                        Discover amazing national and international tour packages tailored to your travel preferences.
                        From weekend getaways to international adventures, we have the perfect tour for every traveler.
                    </p>
                </header>

                <div className='grid grid-cols-1 justify-items-center gap-4 pt-8 xs:gap-5 sm:grid-cols-2 sm:gap-6 sm:pt-10 md:pt-12 lg:grid-cols-3 lg:justify-items-stretch lg:gap-6 lg:pt-14'>
                    {tours.map((tour) => (
                        <TourCard key={tour.title} {...tour} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ExploreTheWorld
