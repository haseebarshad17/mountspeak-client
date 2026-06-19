'use client'

import { useHeroBackgroundImage } from '@/hooks/useHeroBackgroundImage'

import { BookingHeader } from './BookingHeader'

export function BookingHeaderSection() {
    const backgroundImage = useHeroBackgroundImage()

    return (
        <div
            className='relative min-h-[118px] bg-cover bg-center bg-no-repeat'
            style={{ backgroundImage: `url("${backgroundImage}")` }}
        >
            <BookingHeader />
        </div>
    )
}
