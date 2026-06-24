'use client'

import { StorageMediaImage } from '@/components/ui/storage-media-image'
import type { ImageProps } from 'next/image'

import { resolveHomepageMediaUrlOrPlaceholder } from '@/lib/supabase/homepage-media'

type HomepageMediaImageProps = Omit<ImageProps, 'src'> & {
    src: string | null | undefined
}

export function HomepageMediaImage({ src, ...props }: HomepageMediaImageProps) {
    return <StorageMediaImage src={resolveHomepageMediaUrlOrPlaceholder(src)} {...props} />
}
