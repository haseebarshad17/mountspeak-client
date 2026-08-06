'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/api/errors'
import { MessageCode } from '@/lib/messages/codes'
import { getMessage } from '@/lib/messages/get-message'
import { cn } from '@/lib/utils/cn'
import {
    useOptionalUser,
    useSendEmailOtp,
    useVerifyEmailOtp,
} from '@/services/auth/auth.query'
import { isValidAgencyId } from '@/services/specialization/specialization.service'

const FIELD =
    'w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none placeholder:text-[#999] focus:border-[#111]/25'

const RESEND_COOLDOWN_SECONDS = 45

function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

type EmailOtpChallengeProps = {
    agencyId: string
    agencySiteUrl?: string | null
    email: string
    onEmailChange: (email: string) => void
    className?: string
    inputClassName?: string
    /** When true, email field is shown as read-only once authenticated. */
    hideWhenAuthenticated?: boolean
}

/**
 * In-form email OTP: send code → enter OTP → verify → session created.
 * Auth-dependent UI waits until client mount to avoid hydration mismatches.
 */
export function EmailOtpChallenge({
    agencyId,
    agencySiteUrl,
    email,
    onEmailChange,
    className,
    inputClassName,
    hideWhenAuthenticated = true,
}: EmailOtpChallengeProps) {
    const { data: user } = useOptionalUser()
    const sendOtp = useSendEmailOtp()
    const verifyOtp = useVerifyEmailOtp()

    const [mounted, setMounted] = useState(false)
    const [otp, setOtp] = useState('')
    const [codeSent, setCodeSent] = useState(false)
    const [cooldown, setCooldown] = useState(0)
    const [emailError, setEmailError] = useState<string | null>(null)
    const [otpError, setOtpError] = useState<string | null>(null)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (cooldown <= 0) return
        const timer = window.setTimeout(() => setCooldown((value) => value - 1), 1000)
        return () => window.clearTimeout(timer)
    }, [cooldown])

    useEffect(() => {
        if (!mounted || !user?.email) return
        onEmailChange(user.email)
        setCodeSent(false)
        setOtp('')
        // eslint-disable-next-line react-hooks/exhaustive-deps -- sync once auth email is known
    }, [mounted, user?.email])

    const signedIn = Boolean(mounted && user?.email && hideWhenAuthenticated)

    async function handleSendCode() {
        setEmailError(null)
        setOtpError(null)

        if (!isValidEmail(email)) {
            setEmailError(getMessage(MessageCode.BOOKING_REQUEST_EMAIL_INVALID))
            return
        }
        if (!isValidAgencyId(agencyId)) {
            toast.error(getMessage(MessageCode.BOOKING_MISSING_AGENCY))
            return
        }

        try {
            await sendOtp.mutateAsync({
                email: email.trim().toLowerCase(),
                agency_id: agencyId,
                agency_site_url: agencySiteUrl ?? undefined,
            })
            setCodeSent(true)
            setCooldown(RESEND_COOLDOWN_SECONDS)
            toast.success(getMessage(MessageCode.BOOKING_OTP_SENT))
        } catch (error) {
            toast.error(getApiErrorMessage(error, MessageCode.BOOKING_OTP_SEND_FAILED))
        }
    }

    async function handleVerifyCode() {
        setOtpError(null)

        if (!isValidEmail(email)) {
            setEmailError(getMessage(MessageCode.BOOKING_REQUEST_EMAIL_INVALID))
            return
        }
        if (otp.trim().length < 6) {
            setOtpError(getMessage(MessageCode.BOOKING_OTP_INVALID))
            return
        }
        if (!isValidAgencyId(agencyId)) {
            toast.error(getMessage(MessageCode.BOOKING_MISSING_AGENCY))
            return
        }

        try {
            await verifyOtp.mutateAsync({
                email: email.trim().toLowerCase(),
                token: otp.trim(),
                agency_id: agencyId,
            })
            toast.success(getMessage(MessageCode.BOOKING_OTP_VERIFIED))
        } catch (error) {
            setOtpError(getMessage(MessageCode.BOOKING_OTP_INVALID))
            toast.error(getApiErrorMessage(error, MessageCode.BOOKING_OTP_VERIFY_FAILED))
        }
    }

    const busy = sendOtp.isPending || verifyOtp.isPending

    if (signedIn) {
        return (
            <div className={cn('space-y-3 rounded-xl bg-[#FAFAF8] p-4 ring-1 ring-[#EBE8E3]', className)}>
                <label className="block">
                    <span className="mb-2 block text-sm font-medium text-[#374151]">
                        Email
                    </span>
                    <input
                        type="email"
                        value={user?.email ?? ''}
                        readOnly
                        className={cn(FIELD, 'text-[#555]', inputClassName)}
                    />
                    <p className="mt-2 text-sm text-emerald-700">
                        Signed in — ready to book.
                    </p>
                </label>
            </div>
        )
    }

    return (
        <div className={cn('space-y-3 rounded-xl border border-black/5 bg-[#FAFAFA] p-4', className)}>
            <div>
                <p className="text-sm font-medium text-[#111]">Verify your email</p>
                <p className="mt-1 text-xs leading-relaxed text-[#666]">
                    We will send a one-time code to your email. After verification you can submit
                    your booking without leaving this page.
                </p>
            </div>

            <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#888]">
                    Email
                </span>
                <input
                    type="email"
                    value={email}
                    onChange={(event) => {
                        onEmailChange(event.target.value)
                        setEmailError(null)
                        if (codeSent) setCodeSent(false)
                    }}
                    disabled={!mounted || busy}
                    className={cn(FIELD, inputClassName)}
                    placeholder="you@email.com"
                    autoComplete="email"
                />
                {emailError ? <p className="mt-1 text-xs text-red-600">{emailError}</p> : null}
            </label>

            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    disabled={!mounted || busy || cooldown > 0}
                    onClick={() => void handleSendCode()}
                    className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-[#111] transition hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {sendOtp.isPending
                        ? 'Sending…'
                        : codeSent
                          ? cooldown > 0
                              ? `Resend in ${cooldown}s`
                              : 'Resend code'
                          : 'Send code'}
                </button>
            </div>

            {codeSent ? (
                <label className="block">
                    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#888]">
                        OTP code
                    </span>
                    <div className="flex flex-wrap gap-2">
                        <input
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            value={otp}
                            onChange={(event) => {
                                setOtp(event.target.value.replace(/\D/g, '').slice(0, 8))
                                setOtpError(null)
                            }}
                            disabled={busy}
                            className={cn(FIELD, 'max-w-[12rem] tracking-[0.2em]', inputClassName)}
                            placeholder="123456"
                            maxLength={8}
                        />
                        <button
                            type="button"
                            disabled={busy}
                            onClick={() => void handleVerifyCode()}
                            className="rounded-xl bg-[#111] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#222] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {verifyOtp.isPending ? 'Verifying…' : 'Verify'}
                        </button>
                    </div>
                    {otpError ? <p className="mt-1 text-xs text-red-600">{otpError}</p> : null}
                </label>
            ) : null}
        </div>
    )
}

export function isBookingEmailVerified(
    userEmail: string | null | undefined,
    formEmail: string
): boolean {
    if (!userEmail?.trim()) return false
    return userEmail.trim().toLowerCase() === formEmail.trim().toLowerCase()
}
