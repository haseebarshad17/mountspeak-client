'use client'

import { STATIC_UI_COLORS } from '@/data/homepage'
import type { TrustBrand } from '@/services/homepage/homepage.page.types'

import { StorageMediaImage } from '@/components/ui/storage-media-image'
import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import { resolveBrandingLogoUrlOrPlaceholder } from '@/lib/supabase/homepage-media'

function TrustBrandLogo({ brand }: { brand: TrustBrand }) {
    return (
        <figure className='trust-brand-logo flex h-auto sm:w-[100px] w-[70px] shrink-0 
        items-center justify-center'>
            <StorageMediaImage
                src={resolveBrandingLogoUrlOrPlaceholder(brand.src)}
                alt={brand.alt ?? brand.name}
                width={156}
                height={56}
                unoptimized
                className='w-full h-max object-contain opacity-55 grayscale 
                transition-[opacity,filter] duration-300 hover:opacity-100 hover:grayscale-0'
            />
        </figure>
    )
}

function TrustBrandsMarqueeGroup({
    brands,
    ariaHidden,
}: {
    brands: readonly TrustBrand[]
    ariaHidden?: boolean
}) {
    return (
        <div className='trust-brands-marquee-group' aria-hidden={ariaHidden}>
            {brands.map((brand) => (
                <TrustBrandLogo key={brand.id} brand={brand} />
            ))}
        </div>
    )
}

const TrustSection = ({ page }: HomepagePageProps) => {
    const section = page.sections.trust
    const brands = section.brands ?? []

    if (brands.length === 0) {
        return null
    }

    return (
        <section
            className='-mt-4 overflow-hidden bg-white sm:-mt-6'
            aria-labelledby='trust-section-heading'
        >
            <div className='agency-container'>
                <header className='mx-auto max-w-2xl px-1 text-center sm:px-0'>
                    <SectionEyebrow name={section.eyebrow} />
                    <h2
                        id='trust-section-heading'
                        className='agency-section-heading pt-2 text-[22px] font-medium leading-tight sm:pt-3 sm:text-[28px] sm:leading-8 lg:text-[32px] lg:leading-9'
                        style={{ color: STATIC_UI_COLORS.title, fontFamily: 'var(--hp-font-heading)' }}
                    >
                        {section.title}
                    </h2>
                </header>
            </div>

            <div className='trust-brands-marquee mt-6 sm:mt-8'>
                <div className='trust-brands-marquee-track py-1'>
                    <TrustBrandsMarqueeGroup brands={brands} />
                    <TrustBrandsMarqueeGroup brands={brands} ariaHidden />
                </div>
            </div>
        </section>
    )
}

export default TrustSection
