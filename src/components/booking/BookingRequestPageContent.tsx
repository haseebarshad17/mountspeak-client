'use client'

import { Suspense } from 'react'
import { BookingRequestForm } from '@/components/booking/BookingRequestForm'
import { ClassicPageHero } from '@/components/pages/ClassicPageHero'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { AgencyLink } from '@/components/links/AgencyLink'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import { isClassicTemplate } from '@/lib/templates/chrome'
import { resolveThemeAssetUrl } from '@/lib/media/resolve-theme-asset'
import type { HomepagePage } from '@/services/agency/agency.types'
import type { AgencySpecializationCapabilities } from '@/services/specialization/specialization.types'

export function BookingRequestPageContent({
    page,
    capabilities,
    agencyId,
    kind,
    id,
    title,
}: {
    page: HomepagePage
    capabilities: AgencySpecializationCapabilities
    agencyId: string
    kind: 'umrah' | 'international'
    id: string
    title: string
}) {
    const variant = useTemplateVariant()
    const classic = isClassicTemplate(variant)
    const backHref = kind === 'umrah' ? '/packages' : '/international'
    const form = (
        <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-white" />}>
            <BookingRequestForm
                agencyId={agencyId}
                capabilities={capabilities}
                lockedDestination={title}
                listingKind={kind}
                umrahPlanId={kind === 'umrah' ? id : null}
                internationalTourId={kind === 'international' ? id : null}
                title={title}
                subtitle="Your request is linked to this package and reviewed by the agency team."
                submitLabel="Send booking request"
            />
        </Suspense>
    )

    if (classic) {
        return (
            <>
                <SiteHeader page={page} capabilities={capabilities} overlay />
                <main className="site-bg">
                    <ClassicPageHero
                        eyebrow="Booking"
                        title="Request booking"
                        subtitle={`Send an inquiry for this ${
                            kind === 'umrah'
                                ? 'Hajj / Umrah package'
                                : 'international tour'
                        }. The agency will confirm availability and next steps.`}
                        imageSrc={
                            resolveThemeAssetUrl(
                                page.sections?.hero?.backgroundImages?.[0]
                            ) ||
                            resolveThemeAssetUrl(page.sections?.hero?.backgroundImage)
                        }
                        size="default"
                    />
                    <section className="section-spacing section-spacing-top bg-white">
                        <div className="site-container max-w-3xl">
                            <AgencyLink
                                href={backHref}
                                className="text-sm text-[#666] transition hover:text-[#111]"
                            >
                                ← Back to listings
                            </AgencyLink>
                            <div className="mt-6">{form}</div>
                        </div>
                    </section>
                </main>
                <SiteFooter page={page} agencyId={agencyId} capabilities={capabilities} />
            </>
        )
    }

    return (
        <>
            <SiteHeader page={page} capabilities={capabilities} />
            <main className="site-bg min-h-screen px-4 py-10 md:px-6 md:py-14">
                <div className="mx-auto max-w-3xl">
                    <AgencyLink
                        href={backHref}
                        className="text-sm text-[#666] transition hover:text-[#111]"
                    >
                        ← Back to listings
                    </AgencyLink>
                    <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#111]">
                        Request booking
                    </h1>
                    <p className="mt-2 text-sm text-[#666]">
                        Send an inquiry for this{' '}
                        {kind === 'umrah' ? 'Hajj / Umrah package' : 'international tour'}.
                        The agency will confirm availability and next steps.
                    </p>
                    <div className="mt-8">{form}</div>
                </div>
            </main>
            <SiteFooter page={page} agencyId={agencyId} capabilities={capabilities} />
        </>
    )
}
