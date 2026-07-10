import type { Specialization } from '@/services/specializations/specializations.types'

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

export function getHajjUmrahSpecializationIds(
    specializations: readonly Specialization[],
): string[] {
    return specializations.filter((row) => isHajjUmrahSpecializationName(row.name)).map((row) => row.id)
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

/** On Hajj/Umrah sites, replace tour wording with package wording. */
export function adaptTourCopyForUmrah(text: string, isUmrahSite: boolean): string {
    if (!isUmrahSite || !text) return text

    return text
        // Avoid "tour packages" → "package packages"
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
