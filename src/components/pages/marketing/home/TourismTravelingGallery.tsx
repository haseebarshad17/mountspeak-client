'use client'

import { FilterPills } from '@/components/pages/marketing/home/filter-pills'
import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import Image from 'next/image'
import React, { useMemo, useState } from 'react'

const galleryFilters = [
    'All',
    'Culture & Heritage',
    'World tour',
    'Mountains & Valleys',
    'Lakes & Rivers',
    'Advantureal Tour',
] as const

const galleryImages = [
    {
        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80',
        alt: 'Mountain valley landscape',
        category: 'Mountains & Valleys',
    },
    {
        src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
        alt: 'Travelers on a group tour',
        category: 'World tour',
    },
    {
        src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
        alt: 'Scenic mountain peaks',
        category: 'Mountains & Valleys',
    },
    {
        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80',
        alt: 'Mountain valley landscape',
        category: 'Culture & Heritage',
    },
    {
        src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
        alt: 'Travelers on a group tour',
        category: 'Advantureal Tour',
    },
    {
        src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
        alt: 'Scenic mountain peaks',
        category: 'Lakes & Rivers',
    },
] as const

function GalleryImageCard({ src, alt }: { src: string; alt: string }) {
    return (
        <div className='relative aspect-[229.33/305.77] w-full overflow-hidden rounded-[10px]'>
            <Image
                src={src}
                alt={alt}
                fill
                className='object-cover'
                sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 229px'
            />
        </div>
    )
}

const TourismTravelingGallery = () => {
    const [activeFilter, setActiveFilter] = useState('All')

    const filteredImages = useMemo(() => {
        if (activeFilter === 'All') return galleryImages
        return galleryImages.filter((image) => image.category === activeFilter)
    }, [activeFilter])

    return (
        <section
            className='bg-white pb-12 sm:pb-16 md:pb-20 lg:pb-[220px]'
            aria-labelledby='tourism-gallery-heading'
        >
            <div className='agency-container'>
                <header className='mx-auto max-w-[900px] px-1 text-center sm:px-0'>
                    <SectionEyebrow name='Our Gallery' />
                    <h2
                        id='tourism-gallery-heading'
                        className='agency-section-heading pt-2 text-[28px] font-medium leading-tight text-[#14141F] sm:pt-3 sm:text-[34px] sm:leading-[40px] lg:pt-4 lg:text-[40px] lg:leading-[48px]'
                    >
                        Tourism &amp; Traveling Gallery.
                    </h2>
                    <p className='mx-auto max-w-[861px] pt-3 font-roboto text-sm font-normal leading-6 text-neutral-600 sm:pt-4 sm:text-base sm:leading-7 md:pt-5 md:text-lg md:leading-8'>
                        Explore our stunning collection of travel destinations and experiences from around the world.
                        Discover breathtaking landscapes, cultural treasures, and unforgettable adventures.
                    </p>
                </header>
<div className='pb-[60px]'>

                <FilterPills
                    labels={galleryFilters}
                    activeLabel={activeFilter}
                    onLabelChange={setActiveFilter}
                    className='mx-auto max-w-[1290px] pt-6 sm:pt-8 lg:pt-10'
                />
</div>

                {/* Figma: 1424×313.77 row — 6 columns, 12px gap, no slider */}
                <div className='mx-auto mt-6 grid max-w-[1424px] grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-[12px] lg:mt-2 lg:grid-cols-6'>
                    {filteredImages.map((image, index) => (
                        <GalleryImageCard key={`${image.src}-${index}`} src={image.src} alt={image.alt} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default TourismTravelingGallery
