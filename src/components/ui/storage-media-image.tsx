'use client'

import Image, { type ImageProps } from 'next/image'
import { useState } from 'react'

import {
    STORAGE_MEDIA_PLACEHOLDER,
} from '@/lib/supabase/storage-media-placeholder'

type StorageMediaImageProps = Omit<ImageProps, 'src'> & {
    src: string | null | undefined
}

export function StorageMediaImage({ src, alt, onError, ...props }: StorageMediaImageProps) {
    const [imageSrc, setImageSrc] = useState(() => {
        const trimmed = src?.trim()
        return trimmed || STORAGE_MEDIA_PLACEHOLDER
    })

    return (
        <Image
            {...props}
            src={imageSrc}
            alt={alt}
            onError={(event) => {
                onError?.(event)

                if (imageSrc !== STORAGE_MEDIA_PLACEHOLDER) {
                    setImageSrc(STORAGE_MEDIA_PLACEHOLDER)
                }
            }}
        />
    )
}
