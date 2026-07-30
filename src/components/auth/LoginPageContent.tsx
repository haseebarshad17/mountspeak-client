'use client'

import { FormEvent, Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { AuthSplitShell } from '@/components/auth/AuthSplitShell'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import {
    buildAuthCallbackUrl,
    getBrowserOrigin,
    normalizeAuthRedirectPath,
} from '@/lib/auth/auth-urls'
import { primaryButtonClass } from '@/lib/templates/chrome'
import { isValidAgencyId } from '@/services/specialization/specialization.service'
import {
    useGoogleLogin,
    useMagicLinkSignIn,
    useOptionalUser,
} from '@/services/auth/auth.query'
import type { HomepagePage } from '@/services/agency/agency.types'

const RESEND_COOLDOWN_SECONDS = 30

function LoginForm({
    page,
    agencyId,
    siteUrl,
    previewHost,
}: {
    page: HomepagePage
    agencyId: string
    siteUrl: string | null
    previewHost: string | null
}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const variant = useTemplateVariant()
    const { data: user } = useOptionalUser()
    const { mutateAsync: sendMagicLink, isPending } = useMagicLinkSignIn()
    const { mutateAsync: loginWithGoogle, isPending: isGooglePending } =
        useGoogleLogin()

    const emailFromQuery = searchParams.get('email') ?? ''
    const [email, setEmail] = useState(emailFromQuery)
    const [linkSent, setLinkSent] = useState(false)
    const [cooldown, setCooldown] = useState(0)

    const nextPath = useMemo(() => {
        const next = searchParams.get('next')
        if (next?.startsWith('/')) return normalizeAuthRedirectPath(next)
        return '/account/profile'
    }, [searchParams])

    const queryError = searchParams.get('error')

    useEffect(() => {
        if (emailFromQuery) setEmail(emailFromQuery)
    }, [emailFromQuery])

    useEffect(() => {
        if (!queryError) return
        if (queryError === 'customer_site_access_denied') {
            toast.error('You do not have access to this agency site.')
        } else {
            toast.error('Sign-in failed. Please try again.')
        }
    }, [queryError])

    useEffect(() => {
        if (!user) return
        const params = new URLSearchParams()
        if (previewHost) params.set('host', previewHost)
        const q = params.toString()
        router.replace(q ? `${nextPath}?${q}` : nextPath)
        router.refresh()
    }, [user, router, nextPath, previewHost])

    useEffect(() => {
        if (cooldown <= 0) return
        const timer = window.setTimeout(() => setCooldown((c) => Math.max(0, c - 1)), 1000)
        return () => window.clearTimeout(timer)
    }, [cooldown])

    async function sendLink(targetEmail: string) {
        const trimmed = targetEmail.trim()
        if (!trimmed) {
            toast.error('Please enter your email.')
            return
        }

        const emailRedirectTo = buildAuthCallbackUrl({
            origin: getBrowserOrigin(),
            next: nextPath,
            agencyId: isValidAgencyId(agencyId) ? agencyId : null,
            host: previewHost,
        })

        await sendMagicLink({
            email: trimmed,
            emailRedirectTo,
            ...(isValidAgencyId(agencyId) ? { agency_id: agencyId } : {}),
            ...(siteUrl ? { agency_site_url: siteUrl } : {}),
        })

        setLinkSent(true)
        setCooldown(RESEND_COOLDOWN_SECONDS)
        toast.success('Check your inbox for the sign-in link.')
    }

    async function onSubmit(event: FormEvent) {
        event.preventDefault()
        if (isPending || cooldown > 0) return
        try {
            await sendLink(email)
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : 'Unable to send magic link.'
            )
        }
    }

    async function onGoogle() {
        try {
            const redirectTo = buildAuthCallbackUrl({
                origin: getBrowserOrigin(),
                next: nextPath,
                agencyId: isValidAgencyId(agencyId) ? agencyId : null,
                host: previewHost,
            })
            const data = await loginWithGoogle({
                redirectTo,
                agency_id: isValidAgencyId(agencyId) ? agencyId : undefined,
            })
            if (data.url) window.location.href = data.url
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : 'Google sign-in failed.'
            )
        }
    }

    if (linkSent) {
        return (
            <AuthSplitShell
                page={page}
                title="Check your email"
                subtitle={`We sent a magic link to ${email}. Open it on this device to finish signing in.`}
            >
                <div className="space-y-4">
                    <p className="rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm text-[#555]">
                        Didn&apos;t get it? Check spam, or resend after the cooldown.
                    </p>
                    <button
                        type="button"
                        disabled={isPending || cooldown > 0}
                        onClick={() => void sendLink(email)}
                        className={primaryButtonClass(
                            variant,
                            'w-full rounded-xl px-4 py-3 text-sm font-medium disabled:opacity-60'
                        )}
                    >
                        {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend magic link'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setLinkSent(false)}
                        className="w-full text-sm text-[#666] underline-offset-2 hover:underline"
                    >
                        Use a different email
                    </button>
                </div>
            </AuthSplitShell>
        )
    }

    return (
        <AuthSplitShell page={page}>
            <form onSubmit={onSubmit} className="space-y-4">
                <label className="block">
                    <span className="text-xs font-medium uppercase tracking-wide text-[#888]">
                        Email
                    </span>
                    <input
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#111]/30"
                    />
                </label>

                <button
                    type="submit"
                    disabled={isPending || cooldown > 0}
                    className={primaryButtonClass(
                        variant,
                        'w-full rounded-xl px-4 py-3 text-sm font-medium disabled:opacity-60'
                    )}
                >
                    {isPending ? 'Sending link…' : 'Continue with email'}
                </button>
            </form>

            <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-black/10" />
                <span className="text-xs uppercase tracking-wide text-[#888]">or</span>
                <span className="h-px flex-1 bg-black/10" />
            </div>

            <button
                type="button"
                onClick={() => void onGoogle()}
                disabled={isGooglePending}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-medium text-[#111] transition hover:bg-[#FAF7F2] disabled:opacity-60"
            >
                Continue with Google
            </button>

            <p className="mt-6 text-center text-xs leading-relaxed text-[#888]">
                By continuing you agree to receive a one-time sign-in link. No password
                required.
            </p>
        </AuthSplitShell>
    )
}

export function LoginPageContent(props: {
    page: HomepagePage
    agencyId: string
    siteUrl: string | null
    previewHost: string | null
}) {
    return (
        <Suspense
            fallback={
                <div className="site-bg flex min-h-screen items-center justify-center">
                    <div className="h-8 w-8 animate-pulse rounded-full bg-[color-mix(in_srgb,var(--color-brand)_20%,transparent)]" />
                </div>
            }
        >
            <LoginForm {...props} />
        </Suspense>
    )
}
