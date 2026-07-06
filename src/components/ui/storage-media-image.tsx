'use client'

import Image, { type ImageProps } from 'next/image'
import { useEffect, useMemo, useState } from 'react'

import {
    STORAGE_MEDIA_PLACEHOLDER,
} from '@/lib/supabase/storage-media-placeholder'

type StorageMediaImageProps = Omit<ImageProps, 'src'> & {
    src: string | null | undefined
}

export function StorageMediaImage({ src, alt, onError, ...props }: StorageMediaImageProps) {
    const resolvedSrc = useMemo(() => {
        const trimmed = src?.trim()
        return trimmed || STORAGE_MEDIA_PLACEHOLDER
    }, [src])

    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        setHasError(false)
    }, [resolvedSrc])

    const imageSrc = hasError ? STORAGE_MEDIA_PLACEHOLDER : resolvedSrc

    return (
        <Image
            {...props}
            src={imageSrc}
            alt={alt}
            onError={(event) => {
                onError?.(event)

                if (!hasError) {
                    setHasError(true)
                }
            }}
        />
    )
}
