import type { BookingDetailsForm } from './booking.types'

const STORAGE_KEY = 'trip-connect-booking-draft'

export type BookingFormDraft = {
    details: BookingDetailsForm
    activeStep: number
    totalAmount: number
}

function isBrowser() {
    return typeof window !== 'undefined'
}

export function loadBookingDraft(): BookingFormDraft | null {
    if (!isBrowser()) return null

    try {
        const raw = sessionStorage.getItem(STORAGE_KEY)
        if (!raw) return null

        const parsed = JSON.parse(raw) as BookingFormDraft
        if (!parsed?.details || typeof parsed.activeStep !== 'number') return null

        return {
            details: {
                firstName: parsed.details.firstName ?? '',
                lastName: parsed.details.lastName ?? '',
                phone: parsed.details.phone ?? '',
                emergencyPhone: parsed.details.emergencyPhone ?? '',
                cnic: parsed.details.cnic ?? '',
                tourId: parsed.details.tourId ?? '',
                maleSeats: Number(parsed.details.maleSeats) || 0,
                femaleSeats: Number(parsed.details.femaleSeats) || 0,
                kidsSeats:
                    Number(parsed.details.kidsSeats ?? (parsed.details as { childrenCount?: number }).childrenCount) ||
                    0,
                note: parsed.details.note ?? '',
            },
            activeStep: Math.min(Math.max(parsed.activeStep, 0), 1),
            totalAmount: Number(parsed.totalAmount) || 0,
        }
    } catch {
        return null
    }
}

export function saveBookingDraft(draft: BookingFormDraft): void {
    if (!isBrowser()) return

    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    } catch {
        // Ignore quota / private mode errors
    }
}

export function clearBookingDraft(): void {
    if (!isBrowser()) return

    try {
        sessionStorage.removeItem(STORAGE_KEY)
    } catch {
        // ignore
    }
}

export function mergeDetailsWithDraft(
    lockedTourId: string | undefined,
    draft: BookingFormDraft | null,
): BookingDetailsForm {
    const base = draft?.details

    return {
        firstName: base?.firstName ?? '',
        lastName: base?.lastName ?? '',
        phone: base?.phone ?? '',
        emergencyPhone: base?.emergencyPhone ?? '',
        cnic: base?.cnic ?? '',
        tourId: lockedTourId ?? base?.tourId ?? '',
        maleSeats: base?.maleSeats ?? 0,
        femaleSeats: base?.femaleSeats ?? 0,
        kidsSeats: base?.kidsSeats ?? (base as { childrenCount?: number } | undefined)?.childrenCount ?? 0,
        note: base?.note ?? '',
    }
}
