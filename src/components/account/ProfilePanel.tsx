'use client'

import { FormEvent, useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
    useUpdateUserProfile,
    useUserProfile,
} from '@/services/user-profile/user-profile.query'
import { useOptionalUser } from '@/services/auth/auth.query'

export function ProfilePanel() {
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
            <div className="rounded-2xl border border-black/5 bg-white p-8">
                <div className="h-8 w-40 animate-pulse rounded bg-[#EDE7DE]" />
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-12 animate-pulse rounded-xl bg-[#F4F0EA]" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <form
            onSubmit={onSubmit}
            className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm md:p-7"
        >
            <div className="flex items-center gap-4 border-b border-black/5 pb-5">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[#111] text-lg font-semibold text-white">
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
                    <p className="font-semibold text-[#111]">
                        {fullName || 'Your profile'}
                    </p>
                    <p className="text-sm text-[#888]">{user?.email}</p>
                </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="block md:col-span-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-[#888]">
                        Full name
                    </span>
                    <input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-black/10 bg-[#FAF7F2] px-4 py-3 text-sm outline-none focus:border-[#111]/25"
                        placeholder="Your name"
                        required
                        minLength={2}
                    />
                </label>
                <label className="block">
                    <span className="text-xs font-medium uppercase tracking-wide text-[#888]">
                        Email
                    </span>
                    <input
                        value={user?.email ?? ''}
                        disabled
                        className="mt-1.5 w-full rounded-xl border border-black/5 bg-[#F4F0EA] px-4 py-3 text-sm text-[#666]"
                    />
                </label>
                <label className="block">
                    <span className="text-xs font-medium uppercase tracking-wide text-[#888]">
                        Phone
                    </span>
                    <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-black/10 bg-[#FAF7F2] px-4 py-3 text-sm outline-none focus:border-[#111]/25"
                        placeholder="+92 300 0000000"
                    />
                </label>
                <label className="block md:col-span-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-[#888]">
                        Location
                    </span>
                    <input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-black/10 bg-[#FAF7F2] px-4 py-3 text-sm outline-none focus:border-[#111]/25"
                        placeholder="City, country"
                    />
                </label>
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-full bg-[#111] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#333] disabled:opacity-60"
                >
                    {isPending ? 'Saving…' : 'Save changes'}
                </button>
            </div>
        </form>
    )
}
