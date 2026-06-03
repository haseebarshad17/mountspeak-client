'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { buildClientLoginUrlForBooking } from '@/lib/auth/booking-auth'
import { supabase } from '@/lib/supabase/supabase.client'

export function useBookingAuth() {
    const router = useRouter()
    const [userId, setUserId] = useState<string | null>(null)
    const [authReady, setAuthReady] = useState(false)

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
        let mounted = true

        async function verifySession() {
            const user = await resolveUser()

            if (!mounted) return

            if (!user) {
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

            setUserId(session.user.id)
            setAuthReady(true)
        })

        return () => {
            mounted = false
            subscription.unsubscribe()
        }
    }, [redirectToLogin, resolveUser])

    const requireUser = useCallback(async () => {
        const user = await resolveUser()

        if (!user) {
            redirectToLogin()
            return null
        }

        return user
    }, [redirectToLogin, resolveUser])

    return { userId, authReady, requireUser, redirectToLogin }
}
