'use client'

import { FilterPills } from '@/components/pages/marketing/home/filter-pills'
import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import Image from 'next/image'
import React, { useMemo, useState } from 'react'

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

const TourismTravelingGallery = ({ page }: HomepagePageProps) => {
    const section = page.sections.tourismGallery
    const { colors } = page.theme
    const [activeFilter, setActiveFilter] = useState('All')

    const filteredImages = useMemo(() => {
        if (activeFilter === 'All') return section.images
        return section.images.filter((image) => image.category === activeFilter)
    }, [activeFilter])

    return (
        <section className='bg-white' aria-labelledby='tourism-gallery-heading'>
            <div className='agency-container'>
                <header className='mx-auto max-w-[900px] px-1 text-center sm:px-0'>
                    <SectionEyebrow name={section.eyebrow} color={colors.eyebrow} />
                    <h2
                        id='tourism-gallery-heading'
                        className='agency-section-heading pt-2 text-[28px] font-medium leading-tight sm:pt-3 sm:text-[34px] sm:leading-[40px] lg:pt-4 lg:text-[40px] lg:leading-[48px]'
                        style={{ color: colors.title, fontFamily: 'var(--hp-font-heading)' }}
                    >
                        {section.title}
                    </h2>
                    <p
                        className='mx-auto max-w-[861px] pt-3 text-sm font-normal leading-6 sm:pt-4 sm:text-base sm:leading-7 md:pt-5 md:text-lg md:leading-8'
                        style={{ color: colors.textMuted, fontFamily: 'var(--hp-font-body)' }}
                    >
                        {section.paragraph}
                    </p>
                </header>
                <FilterPills
                    labels={section.filters}
                    activeLabel={activeFilter}
                    onLabelChange={setActiveFilter}
                    className='mx-auto max-w-[1290px] pt-6 sm:pt-8 lg:pt-10'
                />

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
