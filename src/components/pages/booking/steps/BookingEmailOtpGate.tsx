'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { HP_THEME_BTN_CLASS, HP_THEME_BTN_STYLE, HP_THEME_OUTLINE_BTN_CLASS, HP_OUTLINE_BTN_STYLE } from '@/data/homepage'
import { getApiErrorMessage } from '@/lib/api/errors'
import { getMessage } from '@/lib/messages/get-message'
import { MessageCode, isMessageCode } from '@/lib/messages/codes'
import { cn } from '@/lib/utils/clsxUtils'
import {
    useSendBookingEmailOtp,
    useVerifyBookingEmailOtp,
} from '@/services/auth/auth.queries'

import { FormInput } from '../FormInput'

type BookingEmailOtpGateProps = {
    agencyId: string
    agencySiteUrl?: string | null
    emailRedirectTo: string
    onVerified: (email: string) => void
}

export function BookingEmailOtpGate({
    agencyId,
    agencySiteUrl,
    emailRedirectTo,
    onVerified,
}: BookingEmailOtpGateProps) {
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [codeSent, setCodeSent] = useState(false)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    const { mutateAsync: sendOtp, isPending: isSending } = useSendBookingEmailOtp()
    const { mutateAsync: verifyOtp, isPending: isVerifying } = useVerifyBookingEmailOtp()

    const clearError = (key: string) => {
        setFieldErrors((prev) => {
            if (!(key in prev)) return prev
            const next = { ...prev }
            delete next[key]
            return next
        })
    }

    const handleSendCode = async () => {
        const trimmed = email.trim().toLowerCase()
        if (!trimmed || !trimmed.includes('@')) {
            setFieldErrors((prev) => ({
                ...prev,
                email: getMessage(MessageCode.AUTH_EMAIL_REQUIRED),
            }))
            toast.error(getMessage(MessageCode.AUTH_EMAIL_REQUIRED))
            return
        }

        if (!agencyId) {
            toast.error(getMessage(MessageCode.AUTH_MISSING_AGENCY))
            return
        }

        try {
            await sendOtp({
                email: trimmed,
                emailRedirectTo,
                agency_id: agencyId,
                ...(agencySiteUrl ? { agency_site_url: agencySiteUrl } : {}),
            })
            setCodeSent(true)
            clearError('email')
            toast.success(getMessage(MessageCode.AUTH_OTP_SENT))
        } catch (error) {
            toast.error(getApiErrorMessage(error, MessageCode.API_AUTH_VERIFY_RESEND_FAILED))
        }
    }

    const handleVerify = async () => {
        const trimmedEmail = email.trim().toLowerCase()
        const trimmedOtp = otp.trim()

        if (!trimmedEmail) {
            setFieldErrors((prev) => ({
                ...prev,
                email: getMessage(MessageCode.AUTH_EMAIL_REQUIRED),
            }))
            return
        }

        if (!trimmedOtp) {
            setFieldErrors((prev) => ({
                ...prev,
                otp: getMessage(MessageCode.AUTH_OTP_REQUIRED),
            }))
            toast.error(getMessage(MessageCode.AUTH_OTP_REQUIRED))
            return
        }

        try {
            await verifyOtp({
                email: trimmedEmail,
                token: trimmedOtp,
                agency_id: agencyId,
            })
            toast.success('Email verified')
            onVerified(trimmedEmail)
        } catch (error) {
            const code =
                error instanceof Error && isMessageCode(error.message)
                    ? error.message
                    : MessageCode.AUTH_OTP_INVALID
            toast.error(getMessage(code))
            if (code !== MessageCode.AUTH_CUSTOMER_SITE_ACCESS_DENIED) {
                setFieldErrors((prev) => ({
                    ...prev,
                    otp: getMessage(MessageCode.AUTH_OTP_INVALID),
                }))
            }
        }
    }

    return (
        <div className='col-span-full rounded-lg border border-neutral-200 bg-neutral-50/80 p-4 sm:p-5'>
            <p className='text-sm font-medium text-neutral-800'>Verify your email to continue</p>
            <p className='mt-1 text-sm text-neutral-600'>
                We will send a one-time code to confirm your email before booking.
            </p>

            <div className='mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end'>
                <FormInput
                    label='Email'
                    type='email'
                    placeholder='you@example.com'
                    required
                    staticField={false}
                    value={email}
                    onChange={(event) => {
                        setEmail(event.target.value)
                        clearError('email')
                        setCodeSent(false)
                    }}
                    error={fieldErrors.email}
                />
                <Button
                    type='button'
                    onClick={() => void handleSendCode()}
                    disabled={isSending || isVerifying}
                    className={cn('h-11 w-full sm:w-auto sm:min-w-[120px]', HP_THEME_OUTLINE_BTN_CLASS)}
                    style={HP_OUTLINE_BTN_STYLE}
                >
                    {isSending ? 'Sending…' : codeSent ? 'Resend code' : 'Send code'}
                </Button>
            </div>

            {codeSent ? (
                <div className='mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end'>
                    <FormInput
                        label='Verification code'
                        placeholder='Enter 6-digit code'
                        required
                        staticField={false}
                        value={otp}
                        onChange={(event) => {
                            setOtp(event.target.value.replace(/\D/g, '').slice(0, 8))
                            clearError('otp')
                        }}
                        error={fieldErrors.otp}
                        inputMode='numeric'
                        autoComplete='one-time-code'
                    />
                    <Button
                        type='button'
                        onClick={() => void handleVerify()}
                        disabled={isSending || isVerifying}
                        className={cn('h-11 w-full sm:w-auto sm:min-w-[120px]', HP_THEME_BTN_CLASS)}
                        style={HP_THEME_BTN_STYLE}
                    >
                        {isVerifying ? 'Verifying…' : 'Verify'}
                    </Button>
                </div>
            ) : null}
        </div>
    )
}
