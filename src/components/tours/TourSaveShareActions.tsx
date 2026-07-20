'use client'

import { useCallback, type MouseEvent } from 'react'
import { Heart, Link2 } from 'lucide-react'
import { toast } from 'sonner'

import { buildLoginUrlForBooking } from '@/lib/auth/booking-auth'
import { getApiErrorMessage } from '@/lib/api/errors'
import { prefixHref } from '@/lib/homepage/agency-preview'
import { MessageCode } from '@/lib/messages/codes'
import { getMessage } from '@/lib/messages/get-message'
import { cn } from '@/lib/utils/clsxUtils'
import { useResolvedAgencyId } from '@/hooks/useResolvedAgencyId'
import { useAgencyPreviewBase, useInternalPathname } from '@/hooks/useAgencyPreviewBase'
import { useSiteListingCopy } from '@/hooks/useTourOrPackageCopy'
import { useOptionalUser } from '@/services/auth/auth.queries'
import {
    useSavedTourIds,
    useToggleSavedTour,
} from '@/services/saved-tours/saved-tours.queries'

type TourSaveShareActionsProps = {
    tourId: string
    shareHref: string
    /** Overlay on card images (top-left). */
    variant?: 'overlay' | 'hero'
    className?: string
}

function stopCardNavigation(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
}

export function TourSaveShareActions({
    tourId,
    shareHref,
    variant = 'overlay',
    className,
}: TourSaveShareActionsProps) {
    const { data: user, isLoading: isUserLoading } = useOptionalUser()
    const { resolvedAgencyId, isAgencySite, isReady } = useResolvedAgencyId()
    const internalPathname = useInternalPathname()
    const previewBase = useAgencyPreviewBase()
    const { savedPage } = useSiteListingCopy()

    const { data: savedIds } = useSavedTourIds(
        user?.id ?? null,
        resolvedAgencyId,
        {
            agencyScoped: isAgencySite === true,
            agencyContextResolved: isReady,
            enabled: Boolean(user?.id),
        },
    )

    const { mutateAsync: toggleSaved, isPending } = useToggleSavedTour()
    const isSaved = Boolean(savedIds?.has(tourId))

    const isOverlay = variant === 'overlay'
    const buttonClassName = cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-full transition',
        isOverlay
            ? 'bg-white/90 text-[#012b32] shadow-sm backdrop-blur-sm hover:bg-white'
            : 'border border-white/40 bg-black/25 text-white backdrop-blur-sm hover:bg-black/40',
        'disabled:pointer-events-none disabled:opacity-60',
    )

    const handleCopy = useCallback(
        async (event: MouseEvent) => {
            stopCardNavigation(event)

            try {
                const absoluteUrl =
                    typeof window !== 'undefined'
                        ? new URL(shareHref, window.location.origin).toString()
                        : shareHref
                await navigator.clipboard.writeText(absoluteUrl)
                toast.success(getMessage(MessageCode.SUCCESS_TOUR_LINK_COPIED))
            } catch {
                toast.error(getMessage(MessageCode.API_GENERIC))
            }
        },
        [shareHref],
    )

    const handleToggleSave = useCallback(
        async (event: MouseEvent) => {
            stopCardNavigation(event)

            if (!user?.id) {
                toast.error(getMessage(MessageCode.SAVED_TOUR_SIGN_IN_REQUIRED))
                const returnPath = `${internalPathname}${window.location.search}`
                const loginHref = prefixHref(buildLoginUrlForBooking(returnPath), previewBase)
                window.location.assign(loginHref)
                return
            }

            if (!resolvedAgencyId) {
                toast.error(getMessage(MessageCode.AUTH_MISSING_AGENCY))
                return
            }

            try {
                const result = await toggleSaved({
                    tourId,
                    agencyId: resolvedAgencyId,
                    currentlySaved: isSaved,
                })
                toast.success(
                    getMessage(
                        result.saved
                            ? MessageCode.SUCCESS_TOUR_SAVED
                            : MessageCode.SUCCESS_TOUR_UNSAVED,
                    ),
                )
            } catch (error) {
                toast.error(getApiErrorMessage(error, MessageCode.API_SAVED_TOUR_SAVE_FAILED))
            }
        },
        [
            user?.id,
            internalPathname,
            previewBase,
            resolvedAgencyId,
            toggleSaved,
            tourId,
            isSaved,
        ],
    )

    return (
        <div
            className={cn('z-20 flex items-center gap-2', className)}
            onClick={stopCardNavigation}
            onKeyDown={(event) => event.stopPropagation()}
        >
            <button
                type="button"
                aria-label={isSaved ? savedPage.unsaveAriaLabel : savedPage.saveAriaLabel}
                aria-pressed={isSaved}
                disabled={isPending || isUserLoading}
                className={buttonClassName}
                onClick={(event) => {
                    void handleToggleSave(event)
                }}
            >
                <Heart
                    className={cn('h-4 w-4', isSaved && 'fill-current')}
                    strokeWidth={1.75}
                    aria-hidden
                />
            </button>
            <button
                type="button"
                aria-label={savedPage.copyLinkAriaLabel}
                className={buttonClassName}
                onClick={(event) => {
                    void handleCopy(event)
                }}
            >
                <Link2 className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </button>
        </div>
    )
}
