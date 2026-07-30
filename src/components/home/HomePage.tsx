'use client'

import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { Hero } from '@/components/home/sections/Hero'
import { Trust } from '@/components/home/sections/Trust'
import { Intro } from '@/components/home/sections/Intro'
import { Services } from '@/components/home/sections/Services'
import { Destinations } from '@/components/home/sections/Destinations'
import { FeaturedTours } from '@/components/home/sections/FeaturedTours'
import { Gallery } from '@/components/home/sections/Gallery'
import { ContactLead } from '@/components/home/sections/ContactLead'
import { Team } from '@/components/home/sections/Team'
import { Blog } from '@/components/home/sections/Blog'
import { Testimonials } from '@/components/home/sections/Testimonials'
import { collectHeroCardImages } from '@/lib/media/resolve-theme-asset'
import type { HomepagePage } from '@/services/agency/agency.types'
import type { ListingItem } from '@/services/listings/listings.types'
import type {
    AgencySpecializationCapabilities,
    SpecializationKind,
} from '@/services/specialization/specialization.types'

export function HomePage({
    page,
    capabilities,
    listingsByKind,
    destinationsByKind,
    agencyId,
    previewHost = null,
}: {
    page: HomepagePage
    capabilities: AgencySpecializationCapabilities
    listingsByKind: Record<SpecializationKind, ListingItem[]>
    destinationsByKind: Record<SpecializationKind, string[]>
    agencyId: string
    previewHost?: string | null
}) {
    const { sections } = page
    const heroCardImages = collectHeroCardImages([
        ...(sections.hero.backgroundImages ?? []),
        sections.hero.backgroundImage,
        ...(sections.popularDestination?.cards?.map((card) => card.image) ?? []),
        ...(sections.tourismGallery?.images?.map((image) => image.src) ?? []),
        sections.planPerfectTrip?.image?.src,
    ])

    return (
        <>
            <SiteHeader page={page} capabilities={capabilities} overlay />
            <main>
                <Hero
                    data={sections.hero}
                    capabilities={capabilities}
                    cardImages={heroCardImages}
                    destinationsByKind={destinationsByKind}
                    previewHost={previewHost}
                    socialLinks={page.footer?.socialLinks}
                />
                {sections.trust ? <Trust data={sections.trust} /> : null}
                {sections.planPerfectTrip ? (
                    <Intro data={sections.planPerfectTrip} />
                ) : null}
                {sections.ourServices ? <Services data={sections.ourServices} /> : null}
                {sections.popularDestination ? (
                    <Destinations data={sections.popularDestination} />
                ) : null}
                <FeaturedTours
                    data={sections.exploreTheWorld}
                    capabilities={capabilities}
                    listingsByKind={listingsByKind}
                    agencyId={agencyId}
                />
                {sections.tourismGallery ? (
                    <Gallery data={sections.tourismGallery} />
                ) : null}
                {sections.bookATour ? (
                    <ContactLead
                        data={sections.bookATour}
                        agencyId={agencyId}
                        capabilities={capabilities}
                    />
                ) : null}
                {sections.meetOurTeam ? <Team data={sections.meetOurTeam} /> : null}
                {sections.popularTravelBlogs ? (
                    <Blog data={sections.popularTravelBlogs} />
                ) : null}
                {sections.testimonials ? (
                    <Testimonials data={sections.testimonials} />
                ) : null}
            </main>
            <SiteFooter page={page} agencyId={agencyId} />
        </>
    )
}
