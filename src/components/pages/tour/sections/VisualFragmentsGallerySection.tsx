import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import type { TourPage } from './tour-page.types'

type VisualFragmentsGallerySectionProps = {
    page: TourPage
}

export function VisualFragmentsGallerySection({ page }: VisualFragmentsGallerySectionProps) {
    const { gallerySection, theme } = page
    const media = gallerySection.media
    const heroShot = media[0]
    const topRight = media[1]
    const bottomRight = media[2]
    const wideBottom = media[3]

    return (
        <section
            id={gallerySection.id}
            className="py-16 sm:py-20 lg:py-24"
            style={{ backgroundColor: '#091416', color: '#F5F5F2' }}
        >
            <div className="agency-container">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                            {gallerySection.eyebrow}
                        </p>
                        <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                            {gallerySection.title}
                        </h2>
                    </div>
                    <Link
                        href={gallerySection.actionUrl}
                        className="text-xs font-semibold uppercase tracking-[0.12em] text-white underline decoration-2 underline-offset-4 transition hover:text-white/90"
                        style={{ textDecorationColor: theme.secondaryColor }}
                    >
                        {gallerySection.actionLabel}
                    </Link>
                </div>

                {heroShot ? (
                    <div className="mt-12 grid gap-4 lg:grid-cols-[1.4fr_1fr] lg:gap-5">
                        <div className="relative min-h-[300px] overflow-hidden rounded-2xl lg:min-h-[480px]">
                            <Image
                                src={heroShot.src}
                                alt={heroShot.alt}
                                fill
                                className="object-cover grayscale"
                                sizes="(max-width: 1024px) 100vw, 55vw"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 lg:gap-5">
                            {topRight ? (
                                <div className="relative aspect-square overflow-hidden rounded-2xl">
                                    <Image
                                        src={topRight.src}
                                        alt={topRight.alt}
                                        fill
                                        className="object-cover grayscale"
                                        sizes="(max-width: 1024px) 50vw, 22vw"
                                    />
                                </div>
                            ) : null}
                            {bottomRight ? (
                                <div className="relative aspect-square overflow-hidden rounded-2xl">
                                    <Image
                                        src={bottomRight.src}
                                        alt={bottomRight.alt}
                                        fill
                                        className="object-cover grayscale"
                                        sizes="(max-width: 1024px) 50vw, 22vw"
                                    />
                                </div>
                            ) : null}
                            {wideBottom ? (
                                <div className="relative col-span-2 aspect-[21/9] overflow-hidden rounded-2xl sm:aspect-[16/7]">
                                    <Image
                                        src={wideBottom.src}
                                        alt={wideBottom.alt}
                                        fill
                                        className="object-cover grayscale"
                                        sizes="(max-width: 1024px) 100vw, 45vw"
                                    />
                                </div>
                            ) : null}
                        </div>
                    </div>
                ) : null}
            </div>
        </section>
    )
}
