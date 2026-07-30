'use client'

import * as Popover from '@radix-ui/react-popover'
import { Bookmark, CalendarDays, LogOut, UserRound } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { AgencyLink } from '@/components/links/AgencyLink'
import { useLogout, useOptionalUser } from '@/services/auth/auth.query'
import { useUserProfile } from '@/services/user-profile/user-profile.query'
import { cn } from '@/lib/utils/cn'

function initialsFrom(nameOrEmail: string) {
    const value = nameOrEmail.trim()
    if (!value) return 'U'
    if (value.includes('@')) return value[0]?.toUpperCase() || 'U'
    const parts = value.split(/\s+/).filter(Boolean)
    return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || 'U'
}

const MENU = [
    { label: 'Profile', href: '/account/profile', icon: UserRound },
    { label: 'Bookings', href: '/account/bookings', icon: CalendarDays },
    { label: 'Saved', href: '/account/saved', icon: Bookmark },
] as const

export function ProfileMenu() {
    const [open, setOpen] = useState(false)
    const { data: user } = useOptionalUser()
    const { data: profile } = useUserProfile()
    const { mutateAsync: logout, isPending } = useLogout()

    if (!user) return null

    const label = profile?.fullName || user.email || 'Account'
    const initials = initialsFrom(label)

    async function onLogout() {
        try {
            await logout()
            toast.success('Signed out')
            const host = new URLSearchParams(window.location.search).get('host')
            window.location.href = host
                ? `/?host=${encodeURIComponent(host)}`
                : '/'
        } catch {
            toast.error('Could not sign out')
        }
    }

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
                <button
                    type="button"
                    aria-label="Account menu"
                    className={cn(
                        'inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full',
                        'border border-black/10 bg-[#111] text-sm font-semibold text-white',
                        'transition hover:bg-[#333]'
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
                        initials
                    )}
                </button>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content
                    align="end"
                    sideOffset={10}
                    className="z-50 w-56 overflow-hidden rounded-2xl border border-black/5 bg-white p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
                >
                    <div className="border-b border-black/5 px-3 py-2.5">
                        <p className="truncate text-sm font-semibold text-[#111]">
                            {profile?.fullName || 'Your account'}
                        </p>
                        <p className="truncate text-xs text-[#888]">{user.email}</p>
                    </div>
                    <div className="py-1">
                        {MENU.map((item) => (
                            <AgencyLink
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[#222] transition hover:bg-[#F7F3EE]"
                            >
                                <item.icon className="h-4 w-4 text-[#666]" />
                                {item.label}
                            </AgencyLink>
                        ))}
                    </div>
                    <div className="border-t border-black/5 pt-1">
                        <button
                            type="button"
                            disabled={isPending}
                            onClick={() => void onLogout()}
                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[#B42318] transition hover:bg-[#FFF1F0] disabled:opacity-60"
                        >
                            <LogOut className="h-4 w-4" />
                            {isPending ? 'Signing out…' : 'Log out'}
                        </button>
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    )
}
