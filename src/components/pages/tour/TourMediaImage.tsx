'use client'

import { StorageMediaImage } from '@/components/ui/storage-media-image'
import type { ImageProps } from 'next/image'

import { resolveTourMediaUrlOrPlaceholder } from '@/lib/supabase/tour-media'

type TourMediaImageProps = Omit<ImageProps, 'src'> & {
    src: string | null | undefined
}

export function TourMediaImage({ src, ...props }: TourMediaImageProps) {
    return <StorageMediaImage src={resolveTourMediaUrlOrPlaceholder(src)} {...props} />
}
