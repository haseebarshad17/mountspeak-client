'use client'

import Image, { type ImageProps } from 'next/image'
import { useState } from 'react'

import { TOUR_MEDIA_PLACEHOLDER, resolveTourMediaUrlOrPlaceholder } from '@/lib/supabase/tour-media'

type TourMediaImageProps = Omit<ImageProps, 'src'> & {
    src: string | null | undefined
}

export function TourMediaImage({ src, alt, onError, ...props }: TourMediaImageProps) {
    const [imageSrc, setImageSrc] = useState(() => resolveTourMediaUrlOrPlaceholder(src))

    return (
        <Image
            {...props}
            src={imageSrc}
            alt={alt}
            onError={(event) => {
                onError?.(event)
                if (imageSrc !== TOUR_MEDIA_PLACEHOLDER) {
                    setImageSrc(TOUR_MEDIA_PLACEHOLDER)
                }
            }}
        />
    )
}
