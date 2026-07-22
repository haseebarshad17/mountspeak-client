'use client'

import { useCallback, useMemo, useState } from 'react'

import { DEFAULT_AGENCY_ID } from '@/lib/homepage/default-homepage'
import { buildAuthCallbackUrl, getClientSiteUrl } from '@/lib/utils/site-url'
import { useBookingAuth } from '@/components/pages/booking/useBookingAuth'
import { useResolvedAgencyId } from '@/hooks/useResolvedAgencyId'
import { useAppSelector } from '@/store/hooks'
import { selectHomepageSiteUrl } from '@/store/homepage/homepage.selectors'

type UseBookingRequestEmailGateOptions = {
    /** Path to return to after magic-link / OTP callback. */
    returnPath?: string
}

/**
 * Email OTP gate for agency-site booking request forms
 * (homepage Book a Tour + package inquiry).
 */
export function useBookingRequestEmailGate({
    returnPath = '/',
}: UseBookingRequestEmailGateOptions = {}) {
    const { resolvedAgencyId, isAgencySite, isReady } = useResolvedAgencyId()
    const homepageSiteUrl = useAppSelector(selectHomepageSiteUrl)
    const isDemoMode = isAgencySite === false
    const agencyIdForAuth =
        resolvedAgencyId && resolvedAgencyId !== DEFAULT_AGENCY_ID ? resolvedAgencyId : null

    const {
        user,
        userId,
        userEmail,
        isAuthenticated,
        authReady,
        requireUser,
        setUser,
    } = useBookingAuth({ skipAuth: isDemoMode })

    const [guestEmailVerified, setGuestEmailVerified] = useState(false)

    const requireEmailVerification =
        !isDemoMode && Boolean(agencyIdForAuth) && !isAuthenticated
    const emailVerified = isAuthenticated || guestEmailVerified
    const verifiedEmail = (userEmail ?? '').trim().toLowerCase() || null

    const emailRedirectTo = useMemo(() => {
        if (!agencyIdForAuth) return null
        const siteUrl = (homepageSiteUrl?.trim() || getClientSiteUrl()).replace(/\/$/, '')
        const callbackUrl = buildAuthCallbackUrl(siteUrl, returnPath, agencyIdForAuth)
        try {
            const parsed = new URL(callbackUrl)
            parsed.searchParams.set('auth_email', 'otp')
            return parsed.toString()
        } catch {
            return callbackUrl
        }
    }, [agencyIdForAuth, homepageSiteUrl, returnPath])

    const handleEmailVerified = useCallback(
        async (email: string) => {
            setGuestEmailVerified(true)
            const nextUser = await requireUser()
            if (nextUser) {
                setUser(nextUser)
            }
            return email.trim().toLowerCase()
        },
        [requireUser, setUser],
    )

    return {
        isReady,
        isAgencySite,
        isDemoMode,
        resolvedAgencyId: agencyIdForAuth,
        authReady,
        requireEmailVerification,
        emailVerified,
        verifiedEmail,
        userId,
        user,
        emailRedirectTo,
        handleEmailVerified,
        requireUser,
    }
}
