import type { Specialization } from '@/services/specializations/specializations.types'

export type ListingKind = 'tour' | 'umrah' | 'international'

export function resolveSelectedSpecialization(
    specializationId: string | null | undefined,
    specializations: readonly Specialization[],
): Specialization | null {
    if (!specializationId?.trim() || specializations.length === 0) return null

    return specializations.find((row) => row.id === specializationId.trim()) ?? null
}

export function isHajjUmrahSpecializationName(name: string): boolean {
    const normalized = name.trim().toLowerCase()
    return normalized.includes('hajj') || normalized.includes('umrah') || normalized.includes('umra')
}

export function isInternationalSpecializationName(name: string): boolean {
    return name.trim().toLowerCase().includes('international')
}

export function getHajjUmrahSpecializationIds(
    specializations: readonly Specialization[],
): string[] {
    return specializations.filter((row) => isHajjUmrahSpecializationName(row.name)).map((row) => row.id)
}

export function resolveAgencySpecializationIds(
    specializationId: string | null | undefined,
    agencySpecializationIds: readonly string[] | null | undefined,
): string[] {
    const fromJunction = (agencySpecializationIds ?? []).map((id) => id.trim()).filter(Boolean)
    if (fromJunction.length > 0) {
        return [...new Set(fromJunction)]
    }

    const primary = specializationId?.trim()
    return primary ? [primary] : []
}

export function isMultiSpecializationAgency(
    specializationId: string | null | undefined,
    agencySpecializationIds: readonly string[] | null | undefined,
): boolean {
    return resolveAgencySpecializationIds(specializationId, agencySpecializationIds).length > 1
}

export function resolveSpecializationKind(
    specializationId: string | null | undefined,
    specializations: readonly Specialization[],
): ListingKind | null {
    if (!specializationId?.trim()) return null

    const match = resolveSelectedSpecialization(specializationId, specializations)
    if (!match) return null

    if (isHajjUmrahSpecializationName(match.name)) return 'umrah'
    if (isInternationalSpecializationName(match.name)) return 'international'
    return 'tour'
}

export function resolveOwnedListingKinds(
    specializationId: string | null | undefined,
    agencySpecializationIds: readonly string[] | null | undefined,
    specializations: readonly Specialization[],
): ListingKind[] {
    const ids = resolveAgencySpecializationIds(specializationId, agencySpecializationIds)
    const kinds = ids
        .map((id) => resolveSpecializationKind(id, specializations))
        .filter((kind): kind is ListingKind => Boolean(kind))

    return [...new Set(kinds)]
}

export function hasOwnedListingKind(
    kind: ListingKind,
    specializationId: string | null | undefined,
    agencySpecializationIds: readonly string[] | null | undefined,
    specializations: readonly Specialization[],
): boolean {
    return resolveOwnedListingKinds(specializationId, agencySpecializationIds, specializations).includes(kind)
}

export function usesHajjUmrahBanner(
    specializationId: string | null | undefined,
    specializations: readonly Specialization[],
): boolean {
    if (!specializationId?.trim() || specializations.length === 0) return false

    const match = specializations.find((row) => row.id === specializationId.trim())
    if (!match) return false

    return isHajjUmrahSpecializationName(match.name)
}

/** Single-spec Umrah agencies keep package-focused UX. Multi-spec agencies use generic UX. */
export function shouldUseSingleSpecUmrahUx(
    specializationId: string | null | undefined,
    agencySpecializationIds: readonly string[] | null | undefined,
    specializations: readonly Specialization[],
): boolean {
    if (isMultiSpecializationAgency(specializationId, agencySpecializationIds)) {
        return false
    }

    const ids = resolveAgencySpecializationIds(specializationId, agencySpecializationIds)
    const primaryId = ids[0] ?? specializationId
    return usesHajjUmrahBanner(primaryId, specializations)
}

export function shouldUseSingleSpecInternationalUx(
    specializationId: string | null | undefined,
    agencySpecializationIds: readonly string[] | null | undefined,
    specializations: readonly Specialization[],
): boolean {
    if (isMultiSpecializationAgency(specializationId, agencySpecializationIds)) {
        return false
    }

    const ids = resolveAgencySpecializationIds(specializationId, agencySpecializationIds)
    const primaryId = ids[0] ?? specializationId
    const match = resolveSelectedSpecialization(primaryId, specializations)
    return match ? isInternationalSpecializationName(match.name) : false
}

export function resolveDefaultListingKind(
    specializationId: string | null | undefined,
    agencySpecializationIds: readonly string[] | null | undefined,
    specializations: readonly Specialization[],
): ListingKind {
    const owned = resolveOwnedListingKinds(specializationId, agencySpecializationIds, specializations)
    return owned[0] ?? 'tour'
}

export function parseListingSearchType(
    raw: string | string[] | undefined,
): ListingKind | null {
    const value = Array.isArray(raw) ? raw[0] : raw
    const normalized = value?.trim().toLowerCase()

    if (normalized === 'tour' || normalized === 'tours' || normalized === 'domestic') return 'tour'
    if (normalized === 'umrah' || normalized === 'hajj') return 'umrah'
    if (normalized === 'international') return 'international'

    return null
}

export function resolveListingSearchType(
    requestedType: ListingKind | null,
    specializationId: string | null | undefined,
    agencySpecializationIds: readonly string[] | null | undefined,
    specializations: readonly Specialization[],
): ListingKind {
    const owned = resolveOwnedListingKinds(specializationId, agencySpecializationIds, specializations)

    if (requestedType && owned.includes(requestedType)) {
        return requestedType
    }

    if (shouldUseSingleSpecUmrahUx(specializationId, agencySpecializationIds, specializations)) {
        return 'umrah'
    }

    if (shouldUseSingleSpecInternationalUx(specializationId, agencySpecializationIds, specializations)) {
        return 'international'
    }

    return owned[0] ?? 'tour'
}

export function buildListingSearchPath(type: ListingKind, query?: Record<string, string | undefined>): string {
    const params = new URLSearchParams()
    params.set('type', type)

    if (query) {
        for (const [key, value] of Object.entries(query)) {
            if (value?.trim()) params.set(key, value.trim())
        }
    }

    const qs = params.toString()
    return qs ? `/search?${qs}` : '/search'
}

export function packageDetailPath(kind: Exclude<ListingKind, 'tour'>, id: string): string {
    return `/packages/${kind}/${id}`
}

export function listingUsesPackageCopy(
    listingKind: ListingKind,
    specializationId: string | null | undefined,
    agencySpecializationIds: readonly string[] | null | undefined,
    specializations: readonly Specialization[],
): boolean {
    if (listingKind === 'umrah' || listingKind === 'international') return true
    return shouldUseSingleSpecUmrahUx(specializationId, agencySpecializationIds, specializations)
}

export type SiteCopyMode = 'multi' | 'umrah' | 'international' | 'tour'

export function resolveSiteCopyMode(
    specializationId: string | null | undefined,
    agencySpecializationIds: readonly string[] | null | undefined,
    specializations: readonly Specialization[],
): SiteCopyMode {
    if (isMultiSpecializationAgency(specializationId, agencySpecializationIds)) {
        return 'multi'
    }

    if (shouldUseSingleSpecUmrahUx(specializationId, agencySpecializationIds, specializations)) {
        return 'umrah'
    }

    if (shouldUseSingleSpecInternationalUx(specializationId, agencySpecializationIds, specializations)) {
        return 'international'
    }

    return 'tour'
}

export function getMultiSpecListingCopy() {
    return {
        emptyTitle: 'No listings yet',
        emptyHomeDescription: 'Listings will appear here once they are published.',
        emptyPublishedTitle: 'No listings published yet',
        emptyPublishedDescription: 'No published listings yet. Check back soon.',
        viewAllLabel: 'View all listings',
        loadingLabel: 'Loading listings',
        bookLabel: 'View details',
        listingsNavLabel: 'Explore',
        authLoginSubtitle:
            'Please enter your details to browse listings and manage your bookings.',
        authRegisterSubtitle:
            'Create your account to book trips and manage your travel plans.',
        accountIntro:
            'Update your personal details, manage your security settings, and organize your preferences for upcoming bookings.',
        personalInfoDescription:
            'Basic info, like your name and photo, that you use to manage your bookings.',
        upcomingSectionTitle: 'Upcoming bookings',
        upcomingLoadingLabel: 'Loading your upcoming bookings...',
        upcomingBookingsSummary: (confirmedCount: number, upcomingCount: number) =>
            `You have ${confirmedCount} confirmed booking${confirmedCount === 1 ? '' : 's'} and ${upcomingCount} upcoming trip${upcomingCount === 1 ? '' : 's'}.`,
        upcomingEmptyHint: 'Your booked trips will appear here.',
        upcomingEmptyTitle: 'No upcoming bookings',
        upcomingEmptyDescription:
            'Browse our listings to find your next trip.',
        bookingsPageTitle: 'Your bookings',
        bookingsPageIntro:
            'Manage your upcoming trips, track payments, and keep every detail ready for travel.',
        pastTabLabel: 'Past bookings',
        upcomingEmptyBookingsDescription:
            'You do not have any upcoming bookings yet. Explore our listings to plan your next trip.',
        pastEmptyTitle: 'No past bookings',
        pastEmptyDescription:
            'Completed and cancelled bookings will appear here once you have booking history.',
        viewBookingAction: 'View booking',
        rebookAction: 'Book again',
        fallbackBookingTitle: 'Booking',
        pastBookingThanksNote: 'Thank you for traveling with us.',
        resolveBookingTitle: (title: string) => title,
        resolvePrimaryAction: (action: string) => action,
        resolveRebookAction: (action: string) => action,
        resolvePastNote: (note: string) => note,
        resultsCountLabel: (count: number) => `${count} listing${count === 1 ? '' : 's'} found`,
    } as const
}

export function getInternationalListingCopy() {
    return {
        ...getMultiSpecListingCopy(),
        emptyTitle: 'No international tours yet',
        emptyHomeDescription: 'International tours will appear here once they are published.',
        emptyPublishedTitle: 'No international tours published yet',
        emptyPublishedDescription: 'No published international tours yet. Check back soon.',
        viewAllLabel: 'View all international tours',
        loadingLabel: 'Loading international tours',
        bookLabel: 'View tour',
        listingsNavLabel: 'International',
        bookingsPageTitle: 'Your international tours',
        bookingsPageIntro:
            'Manage your upcoming international tours and keep every detail ready for travel.',
        resultsCountLabel: (count: number) =>
            `${count} international tour${count === 1 ? '' : 's'} found`,
    } as const
}

export function getSavedListingsPageCopy(mode: SiteCopyMode) {
    if (mode === 'multi') {
        return {
            pageTitle: 'Saved Listings',
            pageIntro: 'Listings you have saved for later.',
            emptyTitle: 'No saved listings yet',
            emptyDescription: 'Tap the heart on a listing to save it here.',
            saveAriaLabel: 'Save listing',
            unsaveAriaLabel: 'Remove from saved listings',
            copyLinkAriaLabel: 'Copy listing link',
        } as const
    }

    if (mode === 'umrah') {
        return {
            pageTitle: 'Saved Packages',
            pageIntro: 'Packages you have saved for later.',
            emptyTitle: 'No saved packages yet',
            emptyDescription: 'Tap the heart on a package to save it here.',
            saveAriaLabel: 'Save package',
            unsaveAriaLabel: 'Remove from saved packages',
            copyLinkAriaLabel: 'Copy package link',
        } as const
    }

    return {
        pageTitle: 'Saved Tours',
        pageIntro: 'Tours you have saved for later.',
        emptyTitle: 'No saved tours yet',
        emptyDescription: 'Tap the heart on a tour to save it here.',
        saveAriaLabel: 'Save tour',
        unsaveAriaLabel: 'Remove from saved tours',
        copyLinkAriaLabel: 'Copy tour link',
    } as const
}

export type SiteListingCopy =
    | ReturnType<typeof getMultiSpecListingCopy>
    | ReturnType<typeof getInternationalListingCopy>
    | ReturnType<typeof getTourOrPackageCopy>

export function resolveSiteListingCopy(
    specializationId: string | null | undefined,
    agencySpecializationIds: readonly string[] | null | undefined,
    specializations: readonly Specialization[],
) {
    const mode = resolveSiteCopyMode(specializationId, agencySpecializationIds, specializations)
    const isMultiSpec = mode === 'multi'
    const isUmrahSite = mode === 'umrah'
    const isInternationalSite = mode === 'international'
    const ownedKinds = resolveOwnedListingKinds(
        specializationId,
        agencySpecializationIds,
        specializations,
    )

    const copy: SiteListingCopy =
        mode === 'multi'
            ? getMultiSpecListingCopy()
            : mode === 'international'
              ? getInternationalListingCopy()
              : getTourOrPackageCopy(isUmrahSite)

    const savedListingsLabel = isMultiSpec
        ? 'Saved listings'
        : isUmrahSite
          ? 'Saved packages'
          : isInternationalSite
            ? 'Saved tours'
            : 'Saved tours'

    const savedPage = getSavedListingsPageCopy(mode)

    return {
        mode,
        isMultiSpec,
        isUmrahSite,
        isInternationalSite,
        usesPackageCopy: isUmrahSite || isInternationalSite,
        ownedKinds,
        copy,
        savedListingsLabel,
        savedPage,
        listingsNavLabel: copy.listingsNavLabel,
    }
}

export function resolveListingsNavLabel(
    specializationId: string | null | undefined,
    agencySpecializationIds: readonly string[] | null | undefined,
    specializations: readonly Specialization[],
): string {
    return resolveSiteListingCopy(specializationId, agencySpecializationIds, specializations)
        .listingsNavLabel
}

/** On Hajj/Umrah sites, replace tour wording with package wording. */
export function adaptTourCopyForUmrah(text: string, isUmrahSite: boolean): string {
    if (!isUmrahSite || !text) return text

    return text
        .replace(/\bTour packages\b/g, 'Packages')
        .replace(/\btour packages\b/g, 'packages')
        .replace(/\bTour Packages\b/g, 'Packages')
        .replace(/\bTOUR PACKAGES\b/g, 'PACKAGES')
        .replace(/\bTour package\b/g, 'Package')
        .replace(/\btour package\b/g, 'package')
        .replace(/\bTour Package\b/g, 'Package')
        .replace(/\bTours\b/g, 'Packages')
        .replace(/\btours\b/g, 'packages')
        .replace(/\bTour\b/g, 'Package')
        .replace(/\btour\b/g, 'package')
}

export function getTourOrPackageCopy(isUmrahSite: boolean) {
    if (isUmrahSite) {
        return {
            emptyTitle: 'No packages yet',
            emptyHomeDescription: 'Packages will appear here once they are published.',
            emptyPublishedTitle: 'No packages published yet',
            emptyPublishedDescription: 'No published packages yet. Check back soon.',
            viewAllLabel: 'View All Packages',
            loadingLabel: 'Loading packages',
            bookLabel: 'Book Package',
            listingsNavLabel: 'Packages',
            authLoginSubtitle:
                'Please enter your details to explore packages and manage your bookings.',
            authRegisterSubtitle:
                'Create your account to book packages and plan your next pilgrimage.',
            accountIntro:
                'Update your personal details, manage your security settings, and organize your preferences for upcoming Hajj and Umrah packages.',
            personalInfoDescription:
                'Basic info, like your name and photo, that you use to manage your Hajj and Umrah bookings.',
            upcomingSectionTitle: 'Upcoming Packages',
            upcomingLoadingLabel: 'Loading your upcoming packages...',
            upcomingBookingsSummary: (confirmedCount: number, upcomingCount: number) =>
                `You have ${confirmedCount} confirmed booking${confirmedCount === 1 ? '' : 's'} and ${upcomingCount} upcoming package${upcomingCount === 1 ? '' : 's'}.`,
            upcomingEmptyHint: 'Your booked packages will appear here.',
            upcomingEmptyTitle: 'No upcoming packages',
            upcomingEmptyDescription:
                'Book your next package from our packages page to see it here.',
            bookingsPageTitle: 'Your Packages',
            bookingsPageIntro:
                'Manage your upcoming Hajj and Umrah packages, track payments, and keep every detail ready for your pilgrimage.',
            pastTabLabel: 'Past Packages',
            upcomingEmptyBookingsDescription:
                'You do not have any upcoming bookings yet. Explore our packages to plan your next pilgrimage.',
            pastEmptyTitle: 'No past packages',
            pastEmptyDescription:
                'Completed and cancelled package bookings will appear here once you have booking history.',
            viewBookingAction: 'View Package',
            rebookAction: 'Rebook Package',
            fallbackBookingTitle: 'Package booking',
            pastBookingThanksNote: 'Thank you for choosing us for your pilgrimage.',
            resolveBookingTitle: (title: string) =>
                title === 'Expedition booking' ? 'Package booking' : title,
            resolvePrimaryAction: (action: string) =>
                action === 'View Itinerary' ? 'View Package' : action,
            resolveRebookAction: (action: string) =>
                action === 'Rebook Tour' ? 'Rebook Package' : action,
            resolvePastNote: (note: string) =>
                note === 'Thank you for traveling with us.'
                    ? 'Thank you for choosing us for your pilgrimage.'
                    : note,
            resultsCountLabel: (count: number) =>
                `${count} package${count === 1 ? '' : 's'} found`,
        } as const
    }

    return {
        emptyTitle: 'No tours yet',
        emptyHomeDescription: null,
        emptyPublishedTitle: 'No tours published yet',
        emptyPublishedDescription: 'No published tours yet. Check back soon for new adventures.',
        viewAllLabel: 'View All Tours',
        loadingLabel: 'Loading tours',
        bookLabel: 'Book Tour',
        listingsNavLabel: 'Tours',
        authLoginSubtitle:
            'Please enter your details to explore trips and manage your bookings.',
        authRegisterSubtitle:
            'Create your account to book tours and plan your next adventure.',
        accountIntro:
            'Update your personal details, manage your security settings, and organize your travel preferences for future adventures in Pakistan.',
        personalInfoDescription:
            'Basic info, like your name and photo, that you use on the Pakistan Travel platform.',
        upcomingSectionTitle: 'Upcoming Expeditions',
        upcomingLoadingLabel: 'Loading your upcoming expeditions...',
        upcomingBookingsSummary: (confirmedCount: number, upcomingCount: number) =>
            `You have ${confirmedCount} confirmed booking${confirmedCount === 1 ? '' : 's'} and ${upcomingCount} upcoming expedition${upcomingCount === 1 ? '' : 's'}.`,
        upcomingEmptyHint: 'Your booked expeditions will appear here.',
        upcomingEmptyTitle: 'No upcoming expeditions',
        upcomingEmptyDescription:
            'Book your next expedition from our tours page to see it here.',
        bookingsPageTitle: 'Your Journeys',
        bookingsPageIntro:
            'Manage your upcoming expeditions to the high peaks and serene valleys of Pakistan. Authority in every mile.',
        pastTabLabel: 'Past Expeditions',
        upcomingEmptyBookingsDescription:
            'You do not have any upcoming bookings yet. Explore our tours to plan your next adventure.',
        pastEmptyTitle: 'No past expeditions',
        pastEmptyDescription:
            'Completed and cancelled trips will appear here once you have booking history.',
        viewBookingAction: 'View Itinerary',
        rebookAction: 'Rebook Tour',
        fallbackBookingTitle: 'Expedition booking',
        pastBookingThanksNote: 'Thank you for traveling with us.',
        resolveBookingTitle: (title: string) => title,
        resolvePrimaryAction: (action: string) => action,
        resolveRebookAction: (action: string) => action,
        resolvePastNote: (note: string) => note,
        resultsCountLabel: (count: number) => `${count} tour${count === 1 ? '' : 's'} found`,
    } as const
}
