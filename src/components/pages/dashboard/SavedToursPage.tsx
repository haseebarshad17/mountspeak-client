'use client'

import { useMemo } from 'react'
import { Heart } from 'lucide-react'

import { SectionEmptyState } from '@/components/ui/section-empty-state'
import { TourExploreCard } from '@/components/tours/TourExploreCard'
import { useIsAgencySite } from '@/hooks/useIsAgencySite'
import { useTourOrPackageCopy } from '@/hooks/useTourOrPackageCopy'
import { DEFAULT_AGENCY_ID } from '@/lib/homepage/default-homepage'
import { useOptionalUser } from '@/services/auth/auth.queries'
import { useSavedTours } from '@/services/saved-tours/saved-tours.queries'
import { selectHomepageAgencyId } from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'

import {
    accountPageHeadingClassName,
    accountPageIntroClassName,
} from './account-ui'

const SavedToursPage = () => {
    const { data: currentUser, isLoading: isUserLoading } = useOptionalUser()
    const agencyId = useAppSelector(selectHomepageAgencyId)
    const isAgencySite = useIsAgencySite()
    const { copy, isUmrahSite } = useTourOrPackageCopy()

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

    const pageTitle = isUmrahSite ? 'Saved Packages' : 'Saved Tours'
    const pageIntro = isUmrahSite
        ? 'Packages you have saved for later.'
        : 'Tours you have saved for later.'
    const emptyTitle = isUmrahSite ? 'No saved packages yet' : 'No saved tours yet'
    const emptyDescription = isUmrahSite
        ? 'Tap the heart on a package to save it here.'
        : 'Tap the heart on a tour to save it here.'

    return (
        <main className="w-full md:pl-4">
            <section className="mx-auto w-full max-w-[1100px]">
                <h1 className={accountPageHeadingClassName}>{pageTitle}</h1>
                <p className={accountPageIntroClassName}>{pageIntro}</p>

                {isSavedToursLoading ? (
                    <p className="mt-10 text-sm text-[#707979]">Loading…</p>
                ) : savedTours.length === 0 ? (
                    <div className="mt-10">
                        <SectionEmptyState
                            icon={Heart}
                            title={emptyTitle}
                            description={emptyDescription}
                        />
                    </div>
                ) : (
                    <div className="mt-8 grid grid-cols-1 justify-items-center gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:justify-items-stretch">
                        {savedTours.map((tour) => (
                            <TourExploreCard
                                key={tour.id}
                                tourId={tour.id}
                                slug={tour.slug}
                                discountPercent={tour.discountPercent}
                                pricePerSeat={tour.pricePerSeat}
                                title={tour.title}
                                category={tour.category}
                                image={tour.image}
                                totalBooked={tour.totalBooked}
                                remainingSeats={tour.remainingSeats}
                                daysLeft={tour.daysLeft}
                                departureDate={tour.departureDate}
                                departureSlots={tour.departureSlots}
                                bookLabel={copy.bookLabel}
                                isBookingClosed={tour.isBookingClosed}
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}

export default SavedToursPage
