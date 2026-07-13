'use client'

import { useCallback, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

import { isEmailVerified } from '@/lib/auth/email-verification'
import { supabase } from '@/lib/supabase/supabase.client'

type UseBookingAuthOptions = {
    skipAuth?: boolean
}

export function useBookingAuth({ skipAuth = false }: UseBookingAuthOptions = {}) {
    const [user, setUser] = useState<User | null>(null)
    const [authReady, setAuthReady] = useState(skipAuth)

    const resolveUser = useCallback(async () => {
        const {
            data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
            return session.user
        }

        const {
            data: { user: authUser },
            error,
        } = await supabase.auth.getUser()

        if (error || !authUser) {
            return null
        }

        return authUser
    }, [])

    useEffect(() => {
        if (skipAuth) {
            setAuthReady(true)
            return
        }

        let mounted = true

        async function verifySession() {
            const nextUser = await resolveUser()
            if (!mounted) return

            setUser(nextUser)
            // Guests may stay on the page and verify via OTP on the Details step.
            setAuthReady(true)
        }

        void verifySession()

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            const nextUser = session?.user ?? null
            setUser(nextUser)
            setAuthReady(true)
        })

        return () => {
            mounted = false
            subscription.unsubscribe()
        }
    }, [resolveUser, skipAuth])

    const requireUser = useCallback(async () => {
        if (skipAuth) {
            return null
        }

        const nextUser = await resolveUser()

        if (!nextUser || !isEmailVerified(nextUser)) {
            return null
        }

        setUser(nextUser)
        return nextUser
    }, [resolveUser, skipAuth])

    const isAuthenticated = Boolean(user && isEmailVerified(user))

    return {
        user,
        userId: user?.id ?? null,
        userEmail: user?.email ?? null,
        isAuthenticated,
        authReady,
        requireUser,
        setUser,
    }
}
