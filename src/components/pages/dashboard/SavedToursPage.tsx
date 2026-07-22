'use client'

import { useMemo } from 'react'
import { Heart } from 'lucide-react'

import { SectionEmptyState } from '@/components/ui/section-empty-state'
import { TourExploreCard } from '@/components/tours/TourExploreCard'
import { useIsAgencySite } from '@/hooks/useIsAgencySite'
import { useSiteListingCopy } from '@/hooks/useTourOrPackageCopy'
import { DEFAULT_AGENCY_ID } from '@/lib/homepage/default-homepage'
import type { ListingKind } from '@/lib/homepage/specialization'
import { useOptionalUser } from '@/services/auth/auth.queries'
import { useSavedTours } from '@/services/saved-tours/saved-tours.queries'
import type { SavedTourDisplay } from '@/services/saved-tours/saved-tours.types'
import { listingDetailPath } from '@/services/tours/tours.utils'
import { selectHomepageAgencyId } from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'

import {
    accountPageHeadingClassName,
    accountPageIntroClassName,
} from './account-ui'

const SAVED_SECTION_ORDER: ListingKind[] = ['tour', 'umrah', 'international']

const SAVED_SECTION_LABELS: Record<ListingKind, string> = {
    tour: 'Domestic Tours',
    umrah: 'Hajj & Umrah',
    international: 'International Tours',
}

function groupSavedByKind(items: SavedTourDisplay[]) {
    const groups: Record<ListingKind, SavedTourDisplay[]> = {
        tour: [],
        umrah: [],
        international: [],
    }

    for (const item of items) {
        const kind = item.listingKind ?? 'tour'
        groups[kind].push(item)
    }

    return SAVED_SECTION_ORDER.filter((kind) => groups[kind].length > 0).map((kind) => ({
        kind,
        label: SAVED_SECTION_LABELS[kind],
        items: groups[kind],
    }))
}

const SavedToursPage = () => {
    const { data: currentUser, isLoading: isUserLoading } = useOptionalUser()
    const agencyId = useAppSelector(selectHomepageAgencyId)
    const isAgencySite = useIsAgencySite()
    const { copy, savedPage } = useSiteListingCopy()

    const resolvedAgencyId = useMemo(() => {
        if (!isAgencySite || !agencyId || agencyId === DEFAULT_AGENCY_ID) {
            return undefined
        }
        return agencyId
    }, [agencyId, isAgencySite])

    const { data: savedTours = [], isSavedToursLoading } = useSavedTours(
        currentUser?.id ?? null,
        resolvedAgencyId,
        {
            agencyScoped: isAgencySite === true,
            agencyContextResolved: isAgencySite !== null,
            isUserLoading,
        },
    )

    const sections = useMemo(() => groupSavedByKind(savedTours), [savedTours])

    return (
        <main className="w-full md:pl-4">
            <section className="mx-auto w-full max-w-[1100px]">
                <h1 className={accountPageHeadingClassName}>{savedPage.pageTitle}</h1>
                <p className={accountPageIntroClassName}>{savedPage.pageIntro}</p>

                {isSavedToursLoading ? (
                    <p className="mt-10 text-sm text-[#707979]">Loading…</p>
                ) : savedTours.length === 0 ? (
                    <div className="mt-10">
                        <SectionEmptyState
                            icon={Heart}
                            title={savedPage.emptyTitle}
                            description={savedPage.emptyDescription}
                        />
                    </div>
                ) : (
                    <div className="mt-8 space-y-10 sm:mt-10 sm:space-y-12">
                        {sections.map((section) => (
                            <section key={section.kind} aria-labelledby={`saved-${section.kind}-heading`}>
                                <div className="mb-4 flex items-end justify-between gap-3 border-b border-[#E6EBED] pb-3 sm:mb-5">
                                    <div>
                                        <h2
                                            id={`saved-${section.kind}-heading`}
                                            className="font-jost text-lg font-semibold tracking-tight text-[#14141F] sm:text-xl"
                                        >
                                            {section.label}
                                        </h2>
                                        <p className="mt-0.5 text-xs text-[#707979] sm:text-sm">
                                            {section.items.length} saved
                                            {section.items.length === 1 ? ' listing' : ' listings'}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:justify-items-stretch">
                                    {section.items.map((tour) => (
                                        <TourExploreCard
                                            key={`${tour.listingKind}-${tour.id}`}
                                            tourId={tour.id}
                                            listingKind={tour.listingKind}
                                            slug={tour.slug}
                                            discountPercent={tour.discountPercent}
                                            pricePerSeat={tour.pricePerSeat}
                                            currency={tour.currency}
                                            title={tour.title}
                                            category={tour.listingKind === 'tour' ? tour.category : null}
                                            image={tour.image}
                                            totalBooked={tour.totalBooked}
                                            remainingSeats={tour.remainingSeats}
                                            daysLeft={tour.daysLeft}
                                            departureDate={tour.departureDate}
                                            departureSlots={tour.departureSlots}
                                            bookLabel={copy.bookLabel}
                                            isBookingClosed={tour.isBookingClosed}
                                            detailHref={listingDetailPath(tour)}
                                        />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}

export default SavedToursPage
