'use client'

import { FormEvent, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import {
    accentSolidClass,
    isClassicTemplate,
    primaryButtonClass,
    softFieldClass,
} from '@/lib/templates/chrome'
import { cn } from '@/lib/utils/cn'
import {
    useUpdateUserProfile,
    useUserProfile,
} from '@/services/user-profile/user-profile.query'
import { useOptionalUser } from '@/services/auth/auth.query'

export function ProfilePanel() {
    const variant = useTemplateVariant()
    const classic = isClassicTemplate(variant)
    const modern = variant === 'temp3'
    const { data: user } = useOptionalUser()
    const { data: profile, isLoading } = useUserProfile()
    const { mutateAsync: updateProfile, isPending } = useUpdateUserProfile()

    const [fullName, setFullName] = useState('')
    const [phone, setPhone] = useState('')
    const [location, setLocation] = useState('')

    useEffect(() => {
        if (!profile) return
        setFullName(profile.fullName)
        setPhone(profile.phone)
        setLocation(profile.location)
    }, [profile])

    async function onSubmit(event: FormEvent) {
        event.preventDefault()
        try {
            await updateProfile({ fullName, phone, location })
            toast.success('Profile updated')
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : 'Could not save profile'
            )
        }
    }

    if (isLoading) {
        return (
            <div
                className={cn(
                    'p-8',
                    modern
                        ? 'rounded-[16px] border border-t3-navy/10 bg-white'
                        : 'rounded-2xl border border-black/5 bg-white'
                )}
            >
                <div className="h-8 w-40 animate-pulse rounded bg-[#EDE7DE]" />
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                'h-12 animate-pulse rounded-xl',
                                modern
                                    ? 'border border-t3-navy/10 bg-t3-cream/50'
                                    : classic
                                      ? 'border border-black/10 bg-white'
                                      : 'bg-[#F4F0EA]'
                            )}
                        />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <form
            onSubmit={onSubmit}
            className={cn(
                modern
                    ? 'rounded-[16px] border border-t3-navy/10 bg-white p-5 shadow-[0_10px_30px_rgba(14,27,51,0.05)] sm:p-7'
                    : 'rounded-2xl border border-black/5 bg-white p-5 shadow-sm md:p-7'
            )}
        >
            <div
                className={cn(
                    'flex items-center gap-4 pb-5',
                    modern ? 'border-b border-t3-navy/10' : 'border-b border-black/5'
                )}
            >
                <div
                    className={cn(
                        'flex h-14 w-14 items-center justify-center overflow-hidden rounded-full text-lg font-semibold text-white',
                        accentSolidClass(variant)
                    )}
                >
                    {profile?.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={profile.avatarUrl}
                            alt=""
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        (fullName || user?.email || 'U').slice(0, 1).toUpperCase()
                    )}
                </div>
                <div>
                    <p
                        className={cn(
                            'font-semibold',
                            modern
                                ? 'font-display text-t3-navy'
                                : 'text-[#111]'
                        )}
                    >
                        {fullName || 'Your profile'}
                    </p>
                    <p
                        className={cn(
                            'text-sm',
                            modern ? 'font-ui text-t3-dim' : 'text-[#888]'
                        )}
                    >
                        {user?.email}
                    </p>
                </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="block md:col-span-2">
                    <span
                        className={cn(
                            'text-xs font-medium uppercase tracking-wide',
                            modern ? 'font-ui text-t3-dim' : 'text-[#888]'
                        )}
                    >
                        Full name
                    </span>
                    <input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className={softFieldClass(
                            variant,
                            modern
                                ? 'mt-1.5 w-full'
                                : 'mt-1.5 w-full focus:border-[#111]/25'
                        )}
                        placeholder="Your name"
                        required
                        minLength={2}
                    />
                </label>
                <label className="block">
                    <span
                        className={cn(
                            'text-xs font-medium uppercase tracking-wide',
                            modern ? 'font-ui text-t3-dim' : 'text-[#888]'
                        )}
                    >
                        Email
                    </span>
                    <input
                        value={user?.email ?? ''}
                        disabled
                        className={cn(
                            'mt-1.5 w-full rounded-xl px-4 py-3 text-sm',
                            modern
                                ? 'rounded-[10px] border border-t3-navy/10 bg-t3-cream/60 font-ui text-t3-dim'
                                : classic
                                  ? 'border border-black/10 bg-white text-[#666]'
                                  : 'border border-black/5 bg-[#F4F0EA] text-[#666]'
                        )}
                    />
                </label>
                <label className="block">
                    <span
                        className={cn(
                            'text-xs font-medium uppercase tracking-wide',
                            modern ? 'font-ui text-t3-dim' : 'text-[#888]'
                        )}
                    >
                        Phone
                    </span>
                    <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={softFieldClass(
                            variant,
                            modern
                                ? 'mt-1.5 w-full'
                                : 'mt-1.5 w-full focus:border-[#111]/25'
                        )}
                        placeholder="+92 300 0000000"
                    />
                </label>
                <label className="block md:col-span-2">
                    <span
                        className={cn(
                            'text-xs font-medium uppercase tracking-wide',
                            modern ? 'font-ui text-t3-dim' : 'text-[#888]'
                        )}
                    >
                        Location
                    </span>
                    <input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className={softFieldClass(
                            variant,
                            modern
                                ? 'mt-1.5 w-full'
                                : 'mt-1.5 w-full focus:border-[#111]/25'
                        )}
                        placeholder="City, country"
                    />
                </label>
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    type="submit"
                    disabled={isPending}
                    className={primaryButtonClass(
                        variant,
                        modern
                            ? 'disabled:opacity-60'
                            : 'rounded-full px-6 py-2.5 text-sm font-medium disabled:opacity-60'
                    )}
                >
                    {isPending ? 'Saving…' : 'Save changes'}
                </button>
            </div>
        </form>
    )
}
