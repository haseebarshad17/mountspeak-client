'use client'

import { useCallback, useEffect, useState } from 'react'

import { usePreviewRouter } from '@/hooks/useAgencyPreviewBase'
import { buildClientLoginUrlForBooking } from '@/lib/auth/booking-auth'
import { isEmailVerified } from '@/lib/auth/email-verification'
import { supabase } from '@/lib/supabase/supabase.client'

type UseBookingAuthOptions = {
    skipAuth?: boolean
}

export function useBookingAuth({ skipAuth = false }: UseBookingAuthOptions = {}) {
    const router = usePreviewRouter()
    const [userId, setUserId] = useState<string | null>(null)
    const [authReady, setAuthReady] = useState(skipAuth)

    const redirectToLogin = useCallback(() => {
        router.push(buildClientLoginUrlForBooking())
    }, [router])

    const resolveUser = useCallback(async () => {
        const {
            data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
            return session.user
        }

        const {
            data: { user },
            error,
        } = await supabase.auth.getUser()

        if (error || !user) {
            return null
        }

        return user
    }, [])

    useEffect(() => {
        if (skipAuth) {
            setAuthReady(true)
            return
        }

        let mounted = true

        async function verifySession() {
            const user = await resolveUser()

            if (!mounted) return

            if (!user) {
                redirectToLogin()
                return
            }

            if (!isEmailVerified(user)) {
                redirectToLogin()
                return
            }

            setUserId(user.id)
            setAuthReady(true)
        }

        void verifySession()

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session?.user) {
                setUserId(null)
                setAuthReady(false)
                redirectToLogin()
                return
            }

            if (!isEmailVerified(session.user)) {
                setUserId(null)
                setAuthReady(false)
                redirectToLogin()
                return
            }

            setUserId(session.user.id)
            setAuthReady(true)
        })

        return () => {
            mounted = false
            subscription.unsubscribe()
        }
    }, [redirectToLogin, resolveUser, skipAuth])

    const requireUser = useCallback(async () => {
        if (skipAuth) {
            return null
        }

        const user = await resolveUser()

        if (!user) {
            redirectToLogin()
            return null
        }

        if (!isEmailVerified(user)) {
            redirectToLogin()
            return null
        }

        return user
    }, [redirectToLogin, resolveUser, skipAuth])

    return { userId, authReady, requireUser, redirectToLogin }
}
