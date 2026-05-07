import { ChevronRight, MapPin, Star } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { featuredSectionContent, featuredTours } from './content'

const FeaturedTours = () => {
    return (
        <section className='px-4 py-12'>
            <div className='container'>
                <div className='mb-8 flex flex-wrap items-center justify-between gap-4'>
                    <div>
                        <h2 className='text-3xl'>{featuredSectionContent.title}</h2>
                        <p className='mt-2 text-neutral-600'>{featuredSectionContent.subtitle}</p>
                    </div>
                    <Link
                        href={featuredSectionContent.viewAllHref}
                        className='flex items-center gap-2 text-[rgb(var(--color-primary-600))] transition-all hover:gap-3'
                    >
                        {featuredSectionContent.viewAllLabel}
                        <ChevronRight className='h-5 w-5' />
                    </Link>
                </div>

                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                    {featuredTours.map((tour) => (
                        <Link
                            key={tour.id}
                            href={`/client/tour/${tour.id}`}
                            className='group overflow-hidden rounded-lg bg-white transition-all hover:shadow-xl'
                        >
                            <div className='relative h-48 overflow-hidden'>
                                <img
                                    src={tour.image}
                                    alt={tour.title}
                                    className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-110'
                                />
                                <div className='absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-sm font-medium text-neutral-900'>
                                    {tour.duration}
                                </div>
                            </div>
                            <div className='p-5'>
                                <div className='mb-2 flex items-center gap-2'>
                                    <MapPin className='h-4 w-4 text-neutral-400' />
                                    <span className='text-sm text-neutral-600'>{tour.location}</span>
                                </div>
                                <h3 className='text-xl transition-colors group-hover:text-[rgb(var(--color-primary-600))]'>
                                    {tour.title}
                                </h3>
                                <p className='mb-3 mt-2 text-sm text-neutral-600'>{tour.agency}</p>
                                <div className='flex items-end justify-between'>
                                    <div className='flex items-center gap-1'>
                                        <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                                        <span className='font-medium text-neutral-900'>{tour.rating}</span>
                                        <span className='text-sm text-neutral-500'>({tour.reviews})</span>
                                    </div>
                                    <div className='text-right'>
                                        <div className='text-sm text-neutral-500'>From</div>
                                        <div className='text-2xl font-medium text-[rgb(var(--color-primary-600))]'>
                                            {tour.price}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FeaturedTours
